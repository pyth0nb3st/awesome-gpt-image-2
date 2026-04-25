import Footer from "../../components/Footer";
import { CardGrid } from "../../components/GalleryCards";
import SiteNav from "../../components/SiteNav";
import { absoluteUrl, galleryEntries } from "../../lib/gallery";

export const metadata = {
  title: "GPT Image 2 Prompt Pages",
  description: `Browse ${galleryEntries.length} dedicated GPT Image 2 prompt pages with generated images, tags, exact prompts, and related examples.`,
  alternates: {
    canonical: "/prompts/",
  },
};

export default function PromptsIndexPage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <header className="page-header">
        <p className="meta">Prompt index · {galleryEntries.length} pages</p>
        <h1 className="page-title">GPT Image 2 Prompt Pages</h1>
        <p className="lead">
          Every generated image has its own crawlable prompt page with the exact prompt, visual output, tags, and related
          examples.
        </p>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GPT Image 2 prompt pages",
            url: absoluteUrl("prompts/"),
            numberOfItems: galleryEntries.length,
          }),
        }}
      />
      <CardGrid entries={galleryEntries} />
      <Footer />
    </main>
  );
}
