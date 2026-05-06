import Footer from "../Footer";
import GalleryBehavior from "../GalleryBehavior";
import { GalleryCard } from "../GalleryCards";
import { GitHubIcon } from "../Icons";
import ImageModal from "../ImageModal";
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
import { LOCALES, getCopy, localizedPath, tagLabel } from "../../lib/i18n";

const INITIAL_IMAGE_COUNT = 12;
const IMAGE_BATCH_SIZE = 12;

const promoCopy = {
  en: {
    label: "Partner offer",
    cards: [
      {
        name: "VibeArt",
        href: referralUrl(VIBEART_URL, "home_promo_vibeart_gpt_image_2"),
        eyebrow: "Limited GPT Image 2 deal",
        title: "Get roughly 50 GPT Image 2 generations on VibeArt.",
        body: "Register during the promo window to receive 100 trial credits. GPT Image 2 runs at 2 credits per generation, so you can test about 50 flagship image ideas on an infinite canvas.",
        cta: "Try GPT Image 2 on VibeArt",
        badge: "50 free runs",
      },
      {
        name: "Drill",
        href: referralUrl(DRILL_URL, "home_promo_drill_gptimg2_code"),
        eyebrow: "Reader credits for this gallery",
        title: "Use code GPTIMG2 to redeem Drill credits.",
        body: "Drill keeps explanations inline while you read dense prompts, papers, and docs. Use the GPTIMG2 redemption code to get credits for deeper reading sessions.",
        cta: "Redeem credits on Drill",
        badge: "Code: GPTIMG2",
      },
    ],
  },
  zh: {
    label: "合作推荐",
    cards: [
      {
        name: "VibeArt",
        href: referralUrl(VIBEART_URL, "home_promo_vibeart_gpt_image_2"),
        eyebrow: "GPT Image 2 限时优惠",
        title: "注册 VibeArt, 限时约可免费生成 50 张 GPT Image 2 图片。",
        body: "新注册用户可获得 100 trial credits。GPT Image 2 当前每次生成约 2 credits, 适合在无限画布里批量测试提示词和视觉方向。",
        cta: "去 VibeArt 试 GPT Image 2",
        badge: "约 50 张免费图",
      },
      {
        name: "Drill",
        href: referralUrl(DRILL_URL, "home_promo_drill_gptimg2_code"),
        eyebrow: "给本站用户的阅读 credits",
        title: "在 Drill 使用兑换码 GPTIMG2, 可以兑换 credits。",
        body: "Drill 可以把长文、论文、文档里的难点解释直接展开在原文旁边, 适合拆解复杂 prompt、技术文章和研究材料。",
        cta: "去 Drill 兑换 credits",
        badge: "兑换码 GPTIMG2",
      },
    ],
  },
};

function renderEditorialTitle(title) {
  if (!title) return title;
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) {
    return <em>{trimmed}</em>;
  }
  return (
    <>
      {trimmed.slice(0, lastSpace)} <em>{trimmed.slice(lastSpace + 1)}</em>
    </>
  );
}

export default function HomePageContent({ locale = "en" }) {
  const t = getCopy(locale);
  const promos = promoCopy[locale] ?? promoCopy.en;

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
            <h1>{renderEditorialTitle(t.homeTitle)}</h1>
            <p className="summary">{t.homeDescription}</p>
            <nav className="hero-links" aria-label={t.projectLinks}>
              <a href={localizedPath("/prompts/", locale)}>{t.examples}</a>
              <a href={localizedPath("/tags/", locale)}>{t.topics}</a>
              <a href={localizedPath("/creators/", locale)}>{t.creators}</a>
              <a href={localizedPath("/lucky/", locale)}>{t.lucky}</a>
              <a className="nav-partner" href={referralUrl(DRILL_URL, "hero_drill")}>Drill</a>
              <a className="nav-partner" href={referralUrl(VIBEART_URL, "hero_vibeart")}>VibeArt</a>
              <a
                className="icon-link"
                href={referralUrl(REPO_URL, "hero_github")}
                aria-label={t.github}
                title={t.github}
              >
                <GitHubIcon />
              </a>
              <LanguageSwitch locale={locale} path="/" />
            </nav>
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
              <strong>{LOCALES.length}</strong>
              <span>{t.languageStat}</span>
            </div>
            <div className="stat">
              <strong>{updatedDate}</strong>
              <span>{t.updatedStat}</span>
            </div>
          </div>
        </header>

        <section className="promo-strip" aria-label={promos.label}>
          {promos.cards.map((promo) => (
            <a className={`promo-card promo-card-${promo.name.toLowerCase()}`} href={promo.href} key={promo.name}>
              <span className="promo-kicker">{promo.eyebrow}</span>
              <span className="promo-badge">{promo.badge}</span>
              <strong>{promo.title}</strong>
              <span className="promo-body">{promo.body}</span>
              <span className="promo-cta">{promo.cta}</span>
            </a>
          ))}
        </section>

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
      <ImageModal locale={locale} />
      <GalleryBehavior
        initialImageCount={INITIAL_IMAGE_COUNT}
        imageBatchSize={IMAGE_BATCH_SIZE}
        loadMoreLabel={t.loadMore}
        loadMoreCountLabel={t.loadMoreCount("{count}")}
      />
    </>
  );
}
