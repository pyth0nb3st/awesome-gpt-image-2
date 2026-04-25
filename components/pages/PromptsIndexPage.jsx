import Footer from "../Footer";
import { CardGrid } from "../GalleryCards";
import SiteNav from "../SiteNav";
import { absoluteUrl, galleryEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

export default function PromptsIndexPageContent({ locale = "en" }) {
  const t = getCopy(locale);

  return (
    <main className="site-shell">
      <SiteNav locale={locale} path="/prompts/" />
      <header className="page-header">
        <p className="meta">{t.promptsMeta(galleryEntries.length)}</p>
        <h1 className="page-title">{t.promptsTitle}</h1>
        <p className="lead">{t.promptsDescription}</p>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GPT Image 2 examples",
            url: absoluteUrl("prompts/"),
            numberOfItems: galleryEntries.length,
          }),
        }}
      />
      <CardGrid entries={galleryEntries} locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
