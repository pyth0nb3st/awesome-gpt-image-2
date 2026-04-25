import Footer from "../Footer";
import { CardGrid } from "../GalleryCards";
import ImageModal from "../ImageModal";
import SiteNav from "../SiteNav";
import {
  DRILL_URL,
  VIBEART_URL,
  absoluteUrl,
  imageUrl,
  localizedTagUrl,
  promptExcerpt,
  relatedFor,
  referralUrl,
  tagEntrySet,
} from "../../lib/gallery";
import { getCopy, tagLabel } from "../../lib/i18n";

export default function PromptDetailPageContent({ entry, locale = "en" }) {
  const t = getCopy(locale);
  const { image, index, tags, title } = entry;
  const tagLabels = tags.map((tag) => tagLabel(tag, locale));
  const related = relatedFor(entry);
  const canonical = absoluteUrl(entry.pagePath);
  const fullImageUrl = absoluteUrl(image.path);

  return (
    <>
      <main className="site-shell">
        <SiteNav locale={locale} path={`/${entry.pagePath}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "ImageObject",
                name: title,
                contentUrl: fullImageUrl,
                thumbnailUrl: fullImageUrl,
                caption: promptExcerpt(image.prompt, 240),
                keywords: tags.join(", "),
                width: image.width,
                height: image.height,
                encodingFormat: "image/png",
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: t.siteName, item: absoluteUrl("") },
                  { "@type": "ListItem", position: 2, name: t.examples, item: absoluteUrl("prompts/") },
                  { "@type": "ListItem", position: 3, name: title, item: canonical },
                ],
              },
            ]),
          }}
        />
        <header className="page-header">
          <p className="meta">{t.exampleMeta(index, image.createdAt)}</p>
          <h1 className="page-title">{title}</h1>
          <p className="lead">{image.caption}</p>
          <ul className="tags">
            {tags.map((tag) => (
              <li key={tag}>
                {tagEntrySet.has(tag) ? (
                  <a href={localizedTagUrl(tag, locale)}>{tagLabel(tag, locale)}</a>
                ) : (
                  <span>{tagLabel(tag, locale)}</span>
                )}
              </li>
            ))}
          </ul>
        </header>
        <section className="hero-detail">
          <a
            className="hero-image"
            href={imageUrl(image)}
            data-modal-image
            data-title={title}
            data-caption={image.caption}
            aria-label={t.openPreview(title)}
          >
            <img src={imageUrl(image)} alt={t.cardAlt(title, tagLabels)} width={image.width} height={image.height} />
          </a>
          <div className="panel">
            <p className="meta">{t.reuseTitle}</p>
            <p>{t.reuseBody(tagLabels)}</p>
            <p>
              <a className="button-link" href={referralUrl(DRILL_URL, "prompt_detail_drill")}>
                {t.exploreDrill}
              </a>{" "}
              <a className="button-link" href={referralUrl(VIBEART_URL, "prompt_detail_vibeart")}>
                {t.openVibeArt}
              </a>
            </p>
          </div>
        </section>
        <section className="panel">
          <h2>{t.fullPrompt}</h2>
          <pre>{image.prompt}</pre>
        </section>
        <section>
          <h2 className="section-title">{t.relatedExamples}</h2>
          <CardGrid entries={related} locale={locale} />
        </section>
        <Footer locale={locale} />
      </main>
      <ImageModal locale={locale} />
    </>
  );
}
