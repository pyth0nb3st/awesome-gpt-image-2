import Footer from "../Footer";
import { CardGrid } from "../GalleryCards";
import SiteNav from "../SiteNav";
import { absoluteUrl, humanizeTag, localizedTagUrl, tagEntries, updatedDate } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

export default function TagDetailPageContent({ tag, entries, locale = "en" }) {
  const t = getCopy(locale);
  const label = humanizeTag(tag);
  const relatedTags = tagEntries.filter(([candidate]) => candidate !== tag).slice(0, 12);
  const description = t.tagDescription(entries.length, label);

  return (
    <main className="site-shell">
      <SiteNav locale={locale} path={`/tags/${tag}/`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${label} GPT Image 2 examples`,
            url: absoluteUrl(`tags/${tag}/`),
            description,
            numberOfItems: entries.length,
          }),
        }}
      />
      <header className="page-header">
        <p className="meta">{t.tagMeta(entries.length, updatedDate)}</p>
        <h1 className="page-title">{label}</h1>
        <p className="lead">{description}</p>
      </header>
      <CardGrid entries={entries} locale={locale} />
      <section className="panel">
        <h2>{t.relatedTopics}</h2>
        <ul className="tags">
          {relatedTags.map(([relatedTag, count]) => (
            <li key={relatedTag}>
              <a href={localizedTagUrl(relatedTag, locale)}>
                {humanizeTag(relatedTag)} ({count})
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
