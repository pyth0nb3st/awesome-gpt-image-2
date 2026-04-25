import data from "../gallery.json";
import thumbnailManifest from "../assets/thumbs/manifest.json";
import {
  DRILL_URL,
  REPO_URL,
  SITE_URL,
  VIBEART_URL,
  absoluteUrl,
  buildJsonLd,
  buildSeoDescription,
  cleanTitle,
  displayTags,
  humanizeTag,
  promptExcerpt,
  promptPagePath,
  tagCounts,
  tagPagePath,
} from "../scripts/gallery-utils.mjs";

export {
  DRILL_URL,
  REPO_URL,
  SITE_URL,
  VIBEART_URL,
  absoluteUrl,
  buildJsonLd,
  buildSeoDescription,
  humanizeTag,
  promptExcerpt,
};

export const galleryData = data;
export const updatedDate = data.run?.timestamp ? data.run.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
export const seoDescription = buildSeoDescription(data.images);

export const toSitePath = (path) => `/${String(path).replace(/^\/+/, "")}`;
export const promptUrl = (entry) => toSitePath(entry.pagePath);
export const tagUrl = (tag) => toSitePath(tagPagePath(tag));
export const imageUrl = (image) => toSitePath(image.path);
export const thumbnail = (image) => thumbnailManifest.images?.[image.path] ?? null;
export const thumbnailUrl = (image) => toSitePath(thumbnail(image)?.path ?? image.path);
export const thumbnailDimensions = (image) => {
  const candidate = thumbnail(image);
  return candidate ? { width: candidate.width, height: candidate.height } : { width: image.width, height: image.height };
};
export const localizedPromptUrl = (entry, locale = "en") => (locale === "zh" ? `/zh${promptUrl(entry)}` : promptUrl(entry));
export const localizedTagUrl = (tag, locale = "en") => (locale === "zh" ? `/zh${tagUrl(tag)}` : tagUrl(tag));

export const galleryEntries = data.images.map((image, index) => {
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
    search: [title, image.caption, image.prompt, ...tags].join(" ").toLowerCase(),
  };
});

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
