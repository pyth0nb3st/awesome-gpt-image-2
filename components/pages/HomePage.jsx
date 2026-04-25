import Footer from "../Footer";
import GalleryBehavior from "../GalleryBehavior";
import { GalleryCard } from "../GalleryCards";
import LanguageSwitch from "../LanguageSwitch";
import {
  DRILL_URL,
  REPO_URL,
  VIBEART_URL,
  buildJsonLd,
  galleryData,
  galleryEntries,
  referralUrl,
  tagEntries,
  topTags,
  updatedDate,
} from "../../lib/gallery";
import { getCopy, localizedPath, tagLabel } from "../../lib/i18n";

const INITIAL_IMAGE_COUNT = 12;
const IMAGE_BATCH_SIZE = 12;

export default function HomePageContent({ locale = "en" }) {
  const t = getCopy(locale);

  return (
    <>
      <a className="skip-link" href="#gallery">
        {t.skipToGallery}
      </a>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(galleryData)) }} />
        <header className="hero">
          <div>
            <span className="kicker">{t.kicker}</span>
            <h1>{t.homeTitle}</h1>
            <p className="summary">{t.homeDescription}</p>
            <nav className="hero-links" aria-label={t.projectLinks}>
              <a href={referralUrl(DRILL_URL, "hero_drill")}>Drill</a>
              <a href={referralUrl(VIBEART_URL, "hero_vibeart")}>VibeArt</a>
              <a href={localizedPath("/prompts/", locale)}>{t.examples}</a>
              <a href={localizedPath("/tags/", locale)}>{t.topics}</a>
              <a href={referralUrl(REPO_URL, "hero_github")}>{t.github}</a>
              <LanguageSwitch locale={locale} path="/" />
            </nav>
            <p className="repo-strip">
              {t.source}: <a href={referralUrl(REPO_URL, "source_link")}>{REPO_URL}</a>
            </p>
          </div>
          <div className="stats" aria-label="gallery stats">
            <div className="stat">
              <strong>{galleryEntries.length}</strong>
              <span>{t.imageStat}</span>
            </div>
            <div className="stat">
              <strong>{tagEntries.length}</strong>
              <span>{t.topicStat}</span>
            </div>
            <div className="stat">
              <strong>{galleryEntries.length}</strong>
              <span>{t.exampleStat}</span>
            </div>
            <div className="stat">
              <strong>{updatedDate}</strong>
              <span>{t.updatedStat}</span>
            </div>
          </div>
        </header>

        <section className="controls" aria-label="gallery filters">
          <div className="search-row">
            <input id="search" type="search" placeholder={t.searchPlaceholder} autoComplete="off" />
            <div className="result-count" aria-live="polite">
              <span id="visible-count">{Math.min(INITIAL_IMAGE_COUNT, galleryEntries.length)}</span> /{" "}
              <span id="match-count">{galleryEntries.length}</span> {t.shown}
            </div>
          </div>
          <div className="tag-cloud" aria-label={t.popularTopics}>
            {topTags.map(([tag, count]) => (
              <button className="tag-filter" type="button" data-tag={tag} key={tag}>
                {tagLabel(tag, locale)} <span>{count}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="gallery" className="gallery" aria-label={t.galleryLabel}>
          {galleryEntries.map((entry, index) => (
            <GalleryCard key={entry.pagePath} entry={entry} defer={index >= INITIAL_IMAGE_COUNT} locale={locale} />
          ))}
        </section>
        <div className="load-sentinel" id="load-sentinel" aria-hidden="true">
          <button className="load-more" id="load-more" type="button">
            {t.loadMore}
          </button>
        </div>

        <Footer locale={locale} />
      </main>
      <div className="image-modal" id="image-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
        <button className="modal-backdrop" type="button" data-modal-close aria-label={t.closePreview} />
        <div className="modal-panel">
          <button className="modal-close" type="button" data-modal-close>
            {t.close}
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
      <GalleryBehavior
        initialImageCount={INITIAL_IMAGE_COUNT}
        imageBatchSize={IMAGE_BATCH_SIZE}
        loadMoreLabel={t.loadMore}
        loadMoreCountLabel={t.loadMoreCount("{count}")}
      />
    </>
  );
}
