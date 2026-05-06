import { SITE_URL, absoluteUrl, creatorEntries, creatorUrl, galleryEntries, imageAbsoluteUrl, tagEntries, tagUrl, updatedDate } from "../lib/gallery";

export const dynamic = "force-static";

const topImages = () => galleryEntries.slice(0, 20).map((entry) => imageAbsoluteUrl(entry.image));

const withAlternates = (path, zhPath, entry) => ({
  ...entry,
  alternates: {
    languages: {
      en: absoluteUrl(path),
      zh: absoluteUrl(zhPath),
    },
  },
});

export default function sitemap() {
  const basePages = [
    withAlternates("", "zh/", {
      url: SITE_URL,
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 1,
      images: topImages(),
    }),
    withAlternates("prompts/", "zh/prompts/", {
      url: absoluteUrl("prompts/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
    withAlternates("tags/", "zh/tags/", {
      url: absoluteUrl("tags/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("creators/", "zh/creators/", {
      url: absoluteUrl("creators/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.75,
    }),
    withAlternates("lucky/", "zh/lucky/", {
      url: absoluteUrl("lucky/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.85,
      images: topImages(),
    }),
    withAlternates("", "zh/", {
      url: absoluteUrl("zh/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.95,
      images: topImages(),
    }),
    withAlternates("prompts/", "zh/prompts/", {
      url: absoluteUrl("zh/prompts/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.85,
    }),
    withAlternates("tags/", "zh/tags/", {
      url: absoluteUrl("zh/tags/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.75,
    }),
    withAlternates("creators/", "zh/creators/", {
      url: absoluteUrl("zh/creators/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
    withAlternates("lucky/", "zh/lucky/", {
      url: absoluteUrl("zh/lucky/"),
      lastModified: updatedDate,
      changeFrequency: "weekly",
      priority: 0.8,
      images: topImages(),
    }),
  ];

  const promptPages = galleryEntries.flatMap((entry) => {
    const lastModified = entry.image.createdAt?.slice(0, 10) ?? updatedDate;
    const zhPath = `zh/${entry.pagePath}`;

    return [
      withAlternates(entry.pagePath, zhPath, {
        url: absoluteUrl(entry.pagePath),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        images: [imageAbsoluteUrl(entry.image)],
      }),
      withAlternates(entry.pagePath, zhPath, {
        url: absoluteUrl(zhPath),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.65,
        images: [imageAbsoluteUrl(entry.image)],
      }),
    ];
  });

  const tagPages = tagEntries.flatMap(([tag]) => {
    const path = tagUrl(tag).replace(/^\//, "");
    const zhPath = `zh/${path}`;

    return [
      withAlternates(path, zhPath, {
        url: new URL(path, SITE_URL).toString(),
        lastModified: updatedDate,
        changeFrequency: "monthly",
        priority: 0.5,
      }),
      withAlternates(path, zhPath, {
        url: new URL(zhPath, SITE_URL).toString(),
        lastModified: updatedDate,
        changeFrequency: "monthly",
        priority: 0.45,
      }),
    ];
  });

  const creatorPages = creatorEntries.flatMap((creator) => {
    const path = creatorUrl(creator.slug).replace(/^\//, "");
    const zhPath = `zh/${path}`;

    return [
      withAlternates(path, zhPath, {
        url: absoluteUrl(path),
        lastModified: updatedDate,
        changeFrequency: "monthly",
        priority: 0.48,
      }),
      withAlternates(path, zhPath, {
        url: absoluteUrl(zhPath),
        lastModified: updatedDate,
        changeFrequency: "monthly",
        priority: 0.43,
      }),
    ];
  });

  return [...basePages, ...promptPages, ...tagPages, ...creatorPages];
}
