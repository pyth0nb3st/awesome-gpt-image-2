import { SITE_URL, absoluteUrl, galleryEntries, tagEntries, tagUrl, updatedDate } from "../lib/gallery";

export const dynamic = "force-static";

export default function sitemap() {
  const basePages = [
    {
      url: SITE_URL,
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 1,
      images: galleryEntries.slice(0, 20).map((entry) => absoluteUrl(entry.image.path)),
    },
    {
      url: absoluteUrl("prompts/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("tags/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const promptPages = galleryEntries.map((entry) => ({
    url: absoluteUrl(entry.pagePath),
    lastModified: entry.image.createdAt?.slice(0, 10) ?? updatedDate,
    changeFrequency: "monthly",
    priority: 0.7,
    images: [absoluteUrl(entry.image.path)],
  }));

  const tagPages = tagEntries.map(([tag]) => ({
    url: new URL(tagUrl(tag).replace(/^\//, ""), SITE_URL).toString(),
    lastModified: updatedDate,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...basePages, ...promptPages, ...tagPages];
}
