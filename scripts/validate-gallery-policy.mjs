import { readFile } from "node:fs/promises";

const galleryPath = new URL("../gallery.json", import.meta.url);
const data = JSON.parse(await readFile(galleryPath, "utf8"));

const allowedProvenanceStatus = new Set(["original_generated", "needs_review", "external_attributed"]);
const stopWords = new Set(
  [
    "about",
    "across",
    "after",
    "also",
    "and",
    "are",
    "asset",
    "based",
    "board",
    "case",
    "clean",
    "clear",
    "concept",
    "constraints",
    "contact",
    "create",
    "derived",
    "distinct",
    "each",
    "exact",
    "from",
    "generated",
    "generation",
    "gpt",
    "high",
    "image",
    "into",
    "landscape",
    "mode",
    "modes",
    "only",
    "overall",
    "panel",
    "panels",
    "polished",
    "primary",
    "professional",
    "prompt",
    "quality",
    "readable",
    "request",
    "research",
    "should",
    "show",
    "showing",
    "single",
    "small",
    "style",
    "text",
    "the",
    "this",
    "title",
    "titled",
    "type",
    "use",
    "visual",
    "with",
  ].map((word) => word.toLowerCase()),
);
const blockedPatterns = [
  ["politics", /\b(election|campaign rally|political party|president|prime minister|senator|parliament|propaganda)\b|选举|政党|政治宣传/i],
  ["sexual", /\b(nsfw|porn|pornographic|explicit sexual|nudity|nude|erotic)\b|色情|裸露|露骨性/i],
  ["graphic_violence", /\b(gore|graphic violence|blood-soaked|dismember|decapitat|torture)\b|血腥|肢解|酷刑/i],
  ["harmful", /\b(bomb making|weapon construction|terrorist|self-harm|suicide instructions|bypass safety)\b|炸弹制作|武器制造|自杀教程|绕过安全/i],
];
const negatedBlockedMention =
  /\b(?:no|avoid|without|excluding)\s+(?:[\w-]+\s+){0,6}(?:nsfw|porn|pornographic|explicit sexual|nudity|nude|erotic|gore|graphic violence|blood-soaked|dismember(?:ment)?|decapitat\w*|torture|election|campaign rally|political party|president|prime minister|senator|parliament|propaganda|bomb making|weapon construction|terrorist|self-harm|suicide instructions|bypass safety)\b/gi;

const errors = [];
const warnings = [];
const provenanceWarnings = [];

const tokenize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));

const unique = (items) => [...new Set(items)];

const ngrams = (tokens, size) => {
  const grams = [];
  for (let index = 0; index <= tokens.length - size; index += 1) {
    grams.push(tokens.slice(index, index + size).join(" "));
  }
  return grams;
};

const jaccard = (left, right) => {
  const a = new Set(left);
  const b = new Set(right);
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) {
      intersection += 1;
    }
  }
  return intersection / (a.size + b.size - intersection || 1);
};

const termFrequency = (tokens) => {
  const counts = new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
};

const cosine = (left, right) => {
  const a = termFrequency(left);
  const b = termFrequency(right);
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (const value of a.values()) {
    leftNorm += value * value;
  }
  for (const value of b.values()) {
    rightNorm += value * value;
  }
  for (const [token, value] of a) {
    dot += value * (b.get(token) ?? 0);
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm) || 1);
};

const recordText = (image) =>
  [
    image.title,
    image.caption,
    image.alt,
    image.prompt,
    ...(image.tags ?? []),
    ...(image.promptSources ?? []).map((source) => `${source.title} ${source.usedAs}`),
  ].join("\n");

const safetyScanText = (image) =>
  [image.title, image.caption, image.alt, image.prompt, ...(image.tags ?? [])]
    .join("\n")
    .replace(negatedBlockedMention, " ");

const similarity = (left, right) => {
  const leftTokens = unique(tokenize(recordText(left)));
  const rightTokens = unique(tokenize(recordText(right)));
  const tokenOverlap = jaccard(leftTokens, rightTokens);
  const bigramOverlap = jaccard(unique(ngrams(leftTokens, 2)), unique(ngrams(rightTokens, 2)));
  const tagOverlap = jaccard(left.tags ?? [], right.tags ?? []);
  const vectorSimilarity = cosine(tokenize(recordText(left)), tokenize(recordText(right)));
  const score = Math.max(vectorSimilarity, tokenOverlap * 1.2, bigramOverlap * 2, tagOverlap * 0.45 + tokenOverlap * 0.65);

  return {
    score,
    tokenOverlap,
    bigramOverlap,
    tagOverlap,
    vectorSimilarity,
  };
};

const isFreshRecord = (image) => image.provenance?.status && image.provenance.status !== "needs_review";

const isOlderRecord = (candidate, other) => {
  const candidateTime = Date.parse(String(candidate.createdAt ?? "").replace(" ", "T"));
  const otherTime = Date.parse(String(other.createdAt ?? "").replace(" ", "T"));
  if (Number.isNaN(candidateTime) || Number.isNaN(otherTime)) {
    return true;
  }
  return otherTime < candidateTime;
};

for (const [index, image] of (data.images ?? []).entries()) {
  const label = image.path ?? image.title ?? `image[${index}]`;
  const provenance = image.provenance;
  const promptSources = image.promptSources;
  const contentSafety = image.contentSafety;

  if (!provenance || !allowedProvenanceStatus.has(provenance.status)) {
    errors.push(`${label}: missing provenance.status (${[...allowedProvenanceStatus].join(", ")})`);
  }

  if (!Array.isArray(promptSources)) {
    errors.push(`${label}: promptSources must be an array; use [] only when no external prompt/reference was used`);
  }

  if (provenance?.status === "external_attributed" && (!Array.isArray(promptSources) || promptSources.length === 0)) {
    errors.push(`${label}: external_attributed requires at least one promptSources entry`);
  }

  for (const source of promptSources ?? []) {
    if (!source.title || !source.url || !source.authorOrPublisher || !source.license || !source.accessedAt || !source.usedAs) {
      errors.push(
        `${label}: each prompt source must include title, url, authorOrPublisher, license, accessedAt, and usedAs`,
      );
    }
    if (source.url && !/^https?:\/\//i.test(source.url)) {
      errors.push(`${label}: prompt source url must be an http(s) URL`);
    }
  }

  if (!contentSafety || contentSafety.status !== "screened") {
    errors.push(`${label}: missing contentSafety.status = screened`);
  }

  const scanText = safetyScanText(image);
  for (const [category, pattern] of blockedPatterns) {
    if (pattern.test(scanText)) {
      errors.push(`${label}: blocked content category detected: ${category}`);
    }
  }

  if (provenance?.status === "needs_review") {
    provenanceWarnings.push(`${label}: provenance needs review before broad content licensing`);
  }
}

for (const [candidateIndex, candidate] of (data.images ?? []).entries()) {
  if (!isFreshRecord(candidate)) {
    continue;
  }

  for (const [otherIndex, other] of (data.images ?? []).entries()) {
    if (candidateIndex === otherIndex || candidate.batch === other.batch || !isOlderRecord(candidate, other)) {
      continue;
    }

    const result = similarity(candidate, other);
    const candidateLabel = candidate.path ?? candidate.title ?? `image[${candidateIndex}]`;
    const otherLabel = other.path ?? other.title ?? `image[${otherIndex}]`;
    const detail = `score=${result.score.toFixed(2)}, token=${result.tokenOverlap.toFixed(2)}, phrase=${result.bigramOverlap.toFixed(2)}, tags=${result.tagOverlap.toFixed(2)}`;

    if (result.score >= 0.62 || (result.tokenOverlap >= 0.45 && result.bigramOverlap >= 0.18)) {
      errors.push(`${candidateLabel}: likely duplicate of ${otherLabel} (${detail})`);
    } else if (result.score >= 0.46 || (result.tokenOverlap >= 0.34 && result.bigramOverlap >= 0.1)) {
      warnings.push(`${candidateLabel}: similar to ${otherLabel} (${detail}); verify the mechanism is genuinely new`);
    }
  }
}

if (provenanceWarnings.length) {
  console.warn(`Gallery policy warnings: ${provenanceWarnings.length} records need provenance review.`);
}

if (warnings.length) {
  console.warn("Gallery review warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length) {
  console.error("Gallery policy validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Gallery policy validation passed for ${(data.images ?? []).length} images.`);
