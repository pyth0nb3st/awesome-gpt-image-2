import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import { CardGrid } from "../../../components/GalleryCards";
import SiteNav from "../../../components/SiteNav";
import { absoluteUrl, getEntriesByTag, humanizeTag, tagEntries, tagUrl, updatedDate } from "../../../lib/gallery";

export function generateStaticParams() {
  return tagEntries.map(([tag]) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) return {};

  const label = humanizeTag(tag);
  const description = `Browse ${entries.length} GPT Image 2 ${label.toLowerCase()} prompt examples with generated images, full prompts, tags, and reusable visual ideas.`;

  return {
    title: `${label} GPT Image 2 Prompt Examples`,
    description,
    alternates: {
      canonical: tagUrl(tag),
    },
    openGraph: {
      title: `${label} GPT Image 2 Prompt Examples`,
      description,
      url: tagUrl(tag),
    },
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) notFound();

  const label = humanizeTag(tag);
  const relatedTags = tagEntries.filter(([candidate]) => candidate !== tag).slice(0, 12);
  const description = `Browse ${entries.length} GPT Image 2 ${label.toLowerCase()} prompt examples with generated images, full prompts, tags, and reusable visual ideas.`;

  return (
    <main className="site-shell">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${label} GPT Image 2 prompt examples`,
            url: absoluteUrl(`tags/${tag}/`),
            description,
            numberOfItems: entries.length,
          }),
        }}
      />
      <header className="page-header">
        <p className="meta">
          Tag collection · {entries.length} examples · Updated {updatedDate}
        </p>
        <h1 className="page-title">{label} GPT Image 2 Prompt Examples</h1>
        <p className="lead">{description}</p>
      </header>
      <CardGrid entries={entries} />
      <section className="panel">
        <h2>Related Tag Pages</h2>
        <ul className="tags">
          {relatedTags.map(([relatedTag, count]) => (
            <li key={relatedTag}>
              <a href={tagUrl(relatedTag)}>
                {humanizeTag(relatedTag)} ({count})
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
