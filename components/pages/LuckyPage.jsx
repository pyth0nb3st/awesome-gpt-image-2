import Footer from "../Footer";
import ImageModal from "../ImageModal";
import LuckyDraw from "../LuckyDraw";
import SiteNav from "../SiteNav";
import {
  absoluteUrl,
  galleryEntries,
  imageUrl,
  localizedPromptUrl,
  localizedTagUrl,
  promptExcerpt,
  tagEntrySet,
  thumbnailDimensions,
  thumbnailUrl,
} from "../../lib/gallery";
import { getCopy, tagLabel } from "../../lib/i18n";

const luckyEntriesFor = (locale) =>
  galleryEntries.map((entry) => {
    const dimensions = thumbnailDimensions(entry.image);

    return {
      id: entry.pagePath,
      caption: entry.image.caption,
      dedupeKey: entry.title.toLowerCase(),
      detailUrl: localizedPromptUrl(entry, locale),
      imageUrl: imageUrl(entry.image),
      index: entry.index,
      promptPreview: promptExcerpt(entry.image.prompt, 220),
      tags: entry.tags.map((tag) => ({
        href: tagEntrySet.has(tag) ? localizedTagUrl(tag, locale) : "",
        label: tagLabel(tag, locale),
        value: tag,
      })),
      thumbnailHeight: dimensions.height,
      thumbnailUrl: thumbnailUrl(entry.image),
      thumbnailWidth: dimensions.width,
      title: entry.title,
    };
  });

export default function LuckyPageContent({ locale = "en" }) {
  const t = getCopy(locale);
  const luckyEntries = luckyEntriesFor(locale);
  const pageUrl = locale === "zh" ? absoluteUrl("zh/lucky/") : absoluteUrl("lucky/");

  return (
    <>
      <main className="site-shell">
        <SiteNav locale={locale} path="/lucky/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: t.luckyTitle,
              url: pageUrl,
              description: t.luckyDescription,
              numberOfItems: galleryEntries.length,
            }),
          }}
        />
        <header className="page-header lucky-header">
          <p className="meta">{t.luckyMeta(galleryEntries.length)}</p>
          <h1 className="page-title">{t.luckyTitle}</h1>
          <p className="lead">{t.luckyDescription}</p>
        </header>
        <LuckyDraw entries={luckyEntries} locale={locale} />
        <Footer locale={locale} />
      </main>
      <ImageModal locale={locale} />
    </>
  );
}
