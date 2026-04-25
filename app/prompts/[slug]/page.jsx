import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import { CardGrid } from "../../../components/GalleryCards";
import SiteNav from "../../../components/SiteNav";
import {
  DRILL_URL,
  VIBEART_URL,
  absoluteUrl,
  galleryEntries,
  getEntryBySlug,
  imageUrl,
  promptExcerpt,
  relatedFor,
  tagEntrySet,
  tagUrl,
} from "../../../lib/gallery";

export function generateStaticParams() {
  return galleryEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  const description = promptExcerpt(
    `${entry.title}. Full GPT Image 2 prompt example with generated image, tags ${entry.tags.join(", ")}, and reusable prompt structure.`,
    158,
  );

  return {
    title: `${entry.title} | GPT Image 2 Prompt Example`,
    description,
    alternates: {
      canonical: `/${entry.pagePath}`,
    },
    openGraph: {
      title: `${entry.title} | GPT Image 2 Prompt Example`,
      description,
      url: `/${entry.pagePath}`,
      images: [imageUrl(entry.image)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | GPT Image 2 Prompt Example`,
      description,
      images: [imageUrl(entry.image)],
    },
  };
}

export default async function PromptPage({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const { image, index, tags, title } = entry;
  const related = relatedFor(entry);
  const canonical = absoluteUrl(entry.pagePath);
  const fullImageUrl = absoluteUrl(image.path);

  return (
    <main className="site-shell">
      <SiteNav />
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
                { "@type": "ListItem", position: 1, name: "Gallery", item: absoluteUrl("") },
                { "@type": "ListItem", position: 2, name: "Prompt pages", item: absoluteUrl("prompts/") },
                { "@type": "ListItem", position: 3, name: title, item: canonical },
              ],
            },
          ]),
        }}
      />
      <header className="page-header">
        <p className="meta">
          Prompt example #{String(index + 1).padStart(2, "0")} · {image.createdAt ?? "historical"}
        </p>
        <h1 className="page-title">{title}</h1>
        <p className="lead">{image.caption}</p>
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>{tagEntrySet.has(tag) ? <a href={tagUrl(tag)}>{tag}</a> : <span>{tag}</span>}</li>
          ))}
        </ul>
      </header>
      <section className="hero-detail">
        <a className="hero-image" href={imageUrl(image)}>
          <img src={imageUrl(image)} alt={`${title}. Tags: ${tags.join(", ")}.`} width={image.width} height={image.height} />
        </a>
        <div className="panel">
          <p className="meta">Reusable prompt pattern</p>
          <p>
            This example targets {tags.slice(0, 4).join(", ") || "image-generation"} workflows. Use it as a reference for
            prompt structure, visual constraints, and output review.
          </p>
          <p>
            <a className="button-link" href={DRILL_URL}>
              Explore Drill
            </a>{" "}
            <a className="button-link" href={VIBEART_URL}>
              Open VibeArt
            </a>
          </p>
        </div>
      </section>
      <section className="panel">
        <h2>Full Prompt</h2>
        <pre>{image.prompt}</pre>
      </section>
      <section>
        <h2 className="section-title">Related GPT Image 2 Prompt Examples</h2>
        <CardGrid entries={related} />
      </section>
      <Footer />
    </main>
  );
}
