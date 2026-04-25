import Footer from "../components/Footer";
import GalleryBehavior from "../components/GalleryBehavior";
import { GalleryCard } from "../components/GalleryCards";
import {
  DRILL_URL,
  REPO_URL,
  VIBEART_URL,
  buildJsonLd,
  galleryData,
  galleryEntries,
  seoDescription,
  tagEntries,
  toSitePath,
  topTags,
  updatedDate,
} from "../lib/gallery";

const INITIAL_IMAGE_COUNT = 12;
const IMAGE_BATCH_SIZE = 12;

export const metadata = {
  title: "Awesome GPT Image 2 Prompts & Use Cases Gallery",
  description: seoDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Awesome GPT Image 2 Prompts & Use Cases",
    description: seoDescription,
    url: "/",
    images: [toSitePath(galleryEntries[0].image.path)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awesome GPT Image 2 Prompts & Use Cases",
    description: seoDescription,
    images: [toSitePath(galleryEntries[0].image.path)],
  },
};

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to gallery
      </a>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(galleryData)) }} />
        <header className="hero">
          <div>
            <span className="kicker">Open prompt archive · GitHub Pages</span>
            <h1>Awesome GPT Image 2 Prompts & Use Cases</h1>
            <p className="summary">
              {seoDescription} Every card includes the generated image, searchable tags, and the full prompt text.
            </p>
            <nav className="hero-links" aria-label="Project links">
              <a href={DRILL_URL}>Drill</a>
              <a href={VIBEART_URL}>VibeArt</a>
              <a href="/prompts/">Prompt pages</a>
              <a href="/tags/">Tag pages</a>
              <a href={REPO_URL}>GitHub repo</a>
              <a href="/gallery.json">Raw gallery JSON</a>
              <a href="/sitemap.xml">Sitemap</a>
              <a href="/llms.txt">LLMs.txt</a>
            </nav>
            <p className="repo-strip">
              GitHub source: <a href={REPO_URL}>{REPO_URL}</a>
            </p>
          </div>
          <div className="stats" aria-label="gallery stats">
            <div className="stat">
              <strong>{galleryEntries.length}</strong>
              <span>images</span>
            </div>
            <div className="stat">
              <strong>{tagEntries.length}</strong>
              <span>search tags</span>
            </div>
            <div className="stat">
              <strong>{galleryEntries.length}</strong>
              <span>prompts</span>
            </div>
            <div className="stat">
              <strong>{updatedDate}</strong>
              <span>updated</span>
            </div>
          </div>
        </header>

        <section className="controls" aria-label="gallery filters">
          <div className="search-row">
            <input id="search" type="search" placeholder="Search GPT Image prompts, use cases, tags..." autoComplete="off" />
            <div className="result-count" aria-live="polite">
              <span id="visible-count">{Math.min(INITIAL_IMAGE_COUNT, galleryEntries.length)}</span> /{" "}
              <span id="match-count">{galleryEntries.length}</span> shown
            </div>
          </div>
          <div className="tag-cloud" aria-label="Popular tags">
            {topTags.map(([tag, count]) => (
              <button className="tag-filter" type="button" data-tag={tag} key={tag}>
                {tag} <span>{count}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="gallery" className="gallery" aria-label="GPT Image 2 prompt gallery">
          {galleryEntries.map((entry, index) => (
            <GalleryCard key={entry.pagePath} entry={entry} defer={index >= INITIAL_IMAGE_COUNT} />
          ))}
        </section>
        <div className="load-sentinel" id="load-sentinel" aria-hidden="true">
          <button className="load-more" id="load-more" type="button">
            Load more
          </button>
        </div>

        <Footer />
      </main>
      <div className="image-modal" id="image-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
        <button className="modal-backdrop" type="button" data-modal-close aria-label="Close image preview" />
        <div className="modal-panel">
          <button className="modal-close" type="button" data-modal-close>
            Close
          </button>
          <figure className="modal-figure">
            <img id="modal-image" alt="" />
            <figcaption>
              <strong id="modal-title" />
              <span id="modal-caption" />
            </figcaption>
          </figure>
        </div>
      </div>
      <GalleryBehavior initialImageCount={INITIAL_IMAGE_COUNT} imageBatchSize={IMAGE_BATCH_SIZE} />
    </>
  );
}
