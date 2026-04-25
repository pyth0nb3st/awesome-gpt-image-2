import Footer from "../../components/Footer";
import SiteNav from "../../components/SiteNav";
import { absoluteUrl, humanizeTag, tagEntries, tagUrl } from "../../lib/gallery";

export const metadata = {
  title: "GPT Image 2 Prompt Tags",
  description: `Browse ${tagEntries.length} GPT Image 2 prompt tag collections for UI mockups, product visuals, diagrams, games, storytelling, and evaluation workflows.`,
  alternates: {
    canonical: "/tags/",
  },
};

export default function TagsIndexPage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <header className="page-header">
        <p className="meta">Tag index · {tagEntries.length} collections</p>
        <h1 className="page-title">GPT Image 2 Prompt Tags</h1>
        <p className="lead">Use these tag pages to find reusable prompt patterns by output type, workflow, and creative intent.</p>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GPT Image 2 prompt tags",
            url: absoluteUrl("tags/"),
            numberOfItems: tagEntries.length,
          }),
        }}
      />
      <section className="panel">
        <ul className="tags">
          {tagEntries.map(([tag, count]) => (
            <li key={tag}>
              <a href={tagUrl(tag)}>
                {humanizeTag(tag)} ({count})
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
