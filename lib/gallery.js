import data from "../gallery.json";
import thumbnailManifest from "../assets/thumbs/manifest.json";
import {
  DRILL_URL,
  REPO_URL,
  SITE_URL,
  VIBEART_URL,
  absoluteAssetUrl,
  absoluteUrl,
  assetUrl,
  buildJsonLd,
  buildSeoDescription,
  cleanTitle,
  displayTags,
  humanizeTag,
  promptExcerpt,
  promptPagePath,
  searchTextForImage,
  slugify,
  sortImagesByNewest,
  tagCounts,
  tagPagePath,
} from "../scripts/gallery-utils.mjs";

export {
  DRILL_URL,
  REPO_URL,
  SITE_URL,
  VIBEART_URL,
  absoluteAssetUrl,
  absoluteUrl,
  assetUrl,
  buildJsonLd,
  buildSeoDescription,
  humanizeTag,
  promptExcerpt,
  searchTextForImage,
};

export const galleryImages = sortImagesByNewest(data.images);
export const galleryData = { ...data, images: galleryImages };
export const updatedDate = data.run?.timestamp ? data.run.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
export const seoDescription = buildSeoDescription(galleryImages);

export const toSitePath = (path) => `/${String(path).replace(/^\/+/, "")}`;
export const promptUrl = (entry) => toSitePath(entry.pagePath);
export const tagUrl = (tag) => toSitePath(tagPagePath(tag));
export const creatorUrl = (creator) => toSitePath(`creators/${String(creator).replace(/^\/+|\/+$/g, "")}/`);
export const imageUrl = (image) => assetUrl(image.path);
export const imageAbsoluteUrl = (image) => absoluteAssetUrl(image.path);
export const thumbnail = (image) => thumbnailManifest.images?.[image.path] ?? null;
export const thumbnailUrl = (image) => assetUrl(thumbnail(image)?.path ?? image.path);
export const thumbnailAbsoluteUrl = (image) => absoluteAssetUrl(thumbnail(image)?.path ?? image.path);
export const thumbnailDimensions = (image) => {
  const candidate = thumbnail(image);
  return candidate ? { width: candidate.width, height: candidate.height } : { width: image.width, height: image.height };
};
export const referralUrl = (url, content) => {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("utm_source", "gptimg2.best");
  nextUrl.searchParams.set("utm_medium", "referral");
  nextUrl.searchParams.set("utm_campaign", "gpt_image_2_gallery");
  if (content) {
    nextUrl.searchParams.set("utm_content", content);
  }
  return nextUrl.toString();
};
export const localizedPromptUrl = (entry, locale = "en") => (locale === "zh" ? `/zh${promptUrl(entry)}` : promptUrl(entry));
export const localizedTagUrl = (tag, locale = "en") => (locale === "zh" ? `/zh${tagUrl(tag)}` : tagUrl(tag));
export const localizedCreatorUrl = (creator, locale = "en") => (locale === "zh" ? `/zh${creatorUrl(creator)}` : creatorUrl(creator));

export const isSocialCreditUrl = (value) => {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "").toLowerCase();
    return hostname === "x.com" || hostname === "twitter.com";
  } catch {
    return false;
  }
};

export const socialProfileUrl = (handle) => {
  const cleanHandle = String(handle ?? "").trim().replace(/^@/, "");
  return cleanHandle ? `https://x.com/${cleanHandle}` : "";
};

const parseCreatorName = (source) => {
  const credit = String(source?.authorOrPublisher ?? "").trim();
  const handle = credit.match(/@[-_A-Za-z0-9]+/)?.[0] ?? "";
  const name = credit
    .replace(/\s*\/\s*@[-_A-Za-z0-9]+\s*$/, "")
    .replace(/^@[-_A-Za-z0-9]+\s*\/\s*/, "")
    .trim();

  return {
    name: name || handle || "Unknown creator",
    handle,
    slug: slugify(handle ? handle.replace(/^@/, "") : name || "unknown-creator"),
    profileUrl: socialProfileUrl(handle),
  };
};

export const galleryEntries = galleryImages.map((image, index) => {
  const title = cleanTitle(image, index);
  const tags = displayTags(image);
  const pagePath = promptPagePath(image, index);

  return {
    image,
    index,
    title,
    tags,
    slug: pagePath.split("/").filter(Boolean).at(-1),
    pagePath,
    search: searchTextForImage(image, index),
  };
});

const creatorMap = new Map();
for (const entry of galleryEntries) {
  for (const source of entry.image.promptSources ?? []) {
    if (!isSocialCreditUrl(source.url)) continue;

    const parsed = parseCreatorName(source);
    if (!parsed.slug) continue;

    const creator =
      creatorMap.get(parsed.slug) ??
      {
        slug: parsed.slug,
        name: parsed.name,
        handle: parsed.handle,
        profileUrl: parsed.profileUrl,
        entries: [],
        postUrls: [],
      };

    if (!creator.entries.some((candidate) => candidate.pagePath === entry.pagePath)) {
      creator.entries.push(entry);
    }
    if (source.url && !creator.postUrls.includes(source.url)) {
      creator.postUrls.push(source.url);
    }
    creatorMap.set(parsed.slug, creator);
  }
}

export const creatorEntries = [...creatorMap.values()]
  .map((creator) => ({ ...creator, count: creator.entries.length }))
  .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));

export const entriesByCreator = new Map(creatorEntries.map((creator) => [creator.slug, creator.entries]));
export const getCreatorBySlug = (slug) => creatorEntries.find((creator) => creator.slug === slug);
export const getEntriesByCreator = (slug) => entriesByCreator.get(slug) ?? [];
export const getCreatorBySource = (source) => {
  if (!isSocialCreditUrl(source?.url)) return null;
  return getCreatorBySlug(parseCreatorName(source).slug) ?? null;
};

export const tagEntries = tagCounts(data.images).filter(([, count]) => count >= 2);
export const tagEntrySet = new Set(tagEntries.map(([tag]) => tag));
export const topTags = tagEntries.slice(0, 24);

export const entriesByTag = new Map();
for (const entry of galleryEntries) {
  for (const tag of entry.tags) {
    if (!tagEntrySet.has(tag)) continue;
    entriesByTag.set(tag, [...(entriesByTag.get(tag) ?? []), entry]);
  }
}

export const getEntryBySlug = (slug) => galleryEntries.find((entry) => entry.slug === slug);
export const getEntriesByTag = (tag) => entriesByTag.get(tag) ?? [];

export const relatedFor = (entry, limit = 6) => {
  const seen = new Set([entry.pagePath]);
  const related = [];

  for (const tag of entry.tags) {
    for (const candidate of entriesByTag.get(tag) ?? []) {
      if (seen.has(candidate.pagePath)) continue;
      seen.add(candidate.pagePath);
      related.push(candidate);
      if (related.length >= limit) return related;
    }
  }

  for (const candidate of galleryEntries) {
    if (seen.has(candidate.pagePath)) continue;
    seen.add(candidate.pagePath);
    related.push(candidate);
    if (related.length >= limit) return related;
  }

  return related;
};
