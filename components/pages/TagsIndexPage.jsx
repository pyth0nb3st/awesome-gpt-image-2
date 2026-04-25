import Footer from "../Footer";
import SiteNav from "../SiteNav";
import { absoluteUrl, localizedTagUrl, tagEntries } from "../../lib/gallery";
import { getCopy, tagLabel } from "../../lib/i18n";

export default function TagsIndexPageContent({ locale = "en" }) {
  const t = getCopy(locale);

  return (
    <main className="site-shell">
      <SiteNav locale={locale} path="/tags/" />
      <header className="page-header">
        <p className="meta">{t.tagsMeta(tagEntries.length)}</p>
        <h1 className="page-title">{t.tagsTitle}</h1>
        <p className="lead">{t.tagsDescription}</p>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GPT Image 2 topics",
            url: absoluteUrl("tags/"),
            numberOfItems: tagEntries.length,
          }),
        }}
      />
      <section className="panel">
        <ul className="tags">
          {tagEntries.map(([tag, count]) => (
            <li key={tag}>
              <a href={localizedTagUrl(tag, locale)}>
                {tagLabel(tag, locale)} ({count})
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
