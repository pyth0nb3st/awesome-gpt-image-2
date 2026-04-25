import { readFile } from "node:fs/promises";

const galleryPath = new URL("../gallery.json", import.meta.url);
const data = JSON.parse(await readFile(galleryPath, "utf8"));

const allowedProvenanceStatus = new Set(["original_generated", "needs_review", "external_attributed"]);
const blockedPatterns = [
  ["politics", /\b(election|campaign rally|political party|president|prime minister|senator|parliament|propaganda)\b|选举|政党|政治宣传/i],
  ["sexual", /\b(nsfw|porn|pornographic|explicit sexual|nudity|nude|erotic)\b|色情|裸露|露骨性/i],
  ["graphic_violence", /\b(gore|graphic violence|blood-soaked|dismember|decapitat|torture)\b|血腥|肢解|酷刑/i],
  ["harmful", /\b(bomb making|weapon construction|terrorist|self-harm|suicide instructions|bypass safety)\b|炸弹制作|武器制造|自杀教程|绕过安全/i],
];

const errors = [];
const warnings = [];

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

  const scanText = [image.title, image.caption, image.alt, image.prompt, ...(image.tags ?? [])].join("\n");
  for (const [category, pattern] of blockedPatterns) {
    if (pattern.test(scanText)) {
      errors.push(`${label}: blocked content category detected: ${category}`);
    }
  }

  if (provenance?.status === "needs_review") {
    warnings.push(`${label}: provenance needs review before broad content licensing`);
  }
}

if (warnings.length) {
  console.warn(`Gallery policy warnings: ${warnings.length} records need provenance review.`);
}

if (errors.length) {
  console.error("Gallery policy validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Gallery policy validation passed for ${(data.images ?? []).length} images.`);
