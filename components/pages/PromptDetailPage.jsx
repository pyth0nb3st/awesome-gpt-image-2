import Footer from "../Footer";
import CopyPromptButton from "../CopyPromptButton";
import { CardGrid } from "../GalleryCards";
import ImageModal from "../ImageModal";
import SiteNav from "../SiteNav";
import {
  DRILL_URL,
  VIBEART_URL,
  absoluteUrl,
  imageUrl,
  localizedTagUrl,
  promptExcerpt,
  relatedFor,
  referralUrl,
  tagEntrySet,
} from "../../lib/gallery";
import { getCopy, tagLabel } from "../../lib/i18n";

const isSocialCreditUrl = (value) => {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return hostname === "x.com" || hostname === "twitter.com";
  } catch {
    return false;
  }
};

const tweetCardCache = new Map();

const fetchTweetCardHtml = async (url) => {
  if (!isSocialCreditUrl(url)) return "";
  if (tweetCardCache.has(url)) return tweetCardCache.get(url);

  const requestUrl = new URL("https://publish.twitter.com/oembed");
  requestUrl.searchParams.set("url", url);
  requestUrl.searchParams.set("omit_script", "1");
  requestUrl.searchParams.set("dnt", "1");
  requestUrl.searchParams.set("align", "center");
  requestUrl.searchParams.set("maxwidth", "550");

  try {
    const response = await fetch(requestUrl, { cache: "force-cache" });
    if (!response.ok) {
      tweetCardCache.set(url, "");
      return "";
    }

    const data = await response.json();
    const html = typeof data.html === "string" ? data.html : "";
    tweetCardCache.set(url, html);
    return html;
  } catch {
    tweetCardCache.set(url, "");
    return "";
  }
};

export default async function PromptDetailPageContent({ entry, locale = "en" }) {
  const t = getCopy(locale);
  const { image, index, tags, title } = entry;
  const tagLabels = tags.map((tag) => tagLabel(tag, locale));
  const related = relatedFor(entry);
  const canonical = absoluteUrl(entry.pagePath);
  const fullImageUrl = absoluteUrl(image.path);
  const promptSources = Array.isArray(image.promptSources) ? image.promptSources : [];
  const socialCredits = promptSources.filter((source) => isSocialCreditUrl(source.url));
  const sourceNote = image.provenance?.sourceNote;
  const sources = await Promise.all(
    promptSources.map(async (source) => ({
      ...source,
      tweetCardHtml: await fetchTweetCardHtml(source.url),
    })),
  );
  const hasTweetCards = sources.some((source) => source.tweetCardHtml);

  return (
    <>
      <main className="site-shell">
        <SiteNav locale={locale} path={`/${entry.pagePath}`} />
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
                  { "@type": "ListItem", position: 1, name: t.siteName, item: absoluteUrl("") },
                  { "@type": "ListItem", position: 2, name: t.examples, item: absoluteUrl("prompts/") },
                  { "@type": "ListItem", position: 3, name: title, item: canonical },
                ],
              },
            ]),
          }}
        />
        <header className="page-header">
          <p className="meta">{t.exampleMeta(index, image.createdAt)}</p>
          <h1 className="page-title">{title}</h1>
          <p className="lead">{image.caption}</p>
          <ul className="tags">
            {tags.map((tag) => (
              <li key={tag}>
                {tagEntrySet.has(tag) ? (
                  <a href={localizedTagUrl(tag, locale)}>{tagLabel(tag, locale)}</a>
                ) : (
                  <span>{tagLabel(tag, locale)}</span>
                )}
              </li>
            ))}
          </ul>
        </header>
        <section className="hero-detail">
          <a
            className="hero-image"
            href={imageUrl(image)}
            data-modal-image
            data-title={title}
            data-caption={image.caption}
            aria-label={t.openPreview(title)}
          >
            <img src={imageUrl(image)} alt={t.cardAlt(title, tagLabels)} width={image.width} height={image.height} />
          </a>
          <div className="panel">
            <p className="meta">{t.reuseTitle}</p>
            <p>{t.reuseBody(tagLabels)}</p>
            <p>
              <a className="button-link" href={referralUrl(DRILL_URL, "prompt_detail_drill")}>
                {t.exploreDrill}
              </a>{" "}
              <a className="button-link" href={referralUrl(VIBEART_URL, "prompt_detail_vibeart")}>
                {t.openVibeArt}
              </a>
            </p>
          </div>
        </section>
        <section className="panel prompt-panel">
          <div className="prompt-panel-header">
            <h2>{t.fullPrompt}</h2>
            <CopyPromptButton
              text={image.prompt}
              labels={{
                copy: t.copyPrompt,
                copied: t.copiedPrompt,
                failed: t.copyPromptFailed,
              }}
            />
          </div>
          <pre>{image.prompt}</pre>
        </section>
        {promptSources.length > 0 ? (
          <section className="panel source-panel">
            <div className="prompt-panel-header">
              <h2>{t.sourceCredits}</h2>
              <p className="meta">{t.sourceCount(promptSources.length)}</p>
            </div>
            {socialCredits.length > 0 ? <p className="source-thanks">{t.sourceThanks(socialCredits.length)}</p> : null}
            {sourceNote ? (
              <p className="source-note">
                <strong>{t.sourceNoteLabel}</strong> {sourceNote}
              </p>
            ) : null}
            <div className="source-list">
              {sources.map((source) => (
                <article className="source-item" key={`${source.url}-${source.usedAs}`}>
                  <h3>{source.title}</h3>
                  <p className="source-meta">
                    <strong>{source.authorOrPublisher}</strong>
                  </p>
                  <p className="source-meta">{source.usedAs}</p>
                  <p className="source-meta">
                    {t.sourceAccessedLabel(source.accessedAt)} · {source.license}
                  </p>
                  {source.tweetCardHtml ? (
                    <div className="tweet-card-shell" dangerouslySetInnerHTML={{ __html: source.tweetCardHtml }} />
                  ) : null}
                  <p>
                    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                      {isSocialCreditUrl(source.url) ? t.openOriginalPost : t.openSourceLink}
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <section>
          <h2 className="section-title">{t.relatedExamples}</h2>
          <CardGrid entries={related} locale={locale} />
        </section>
        <Footer locale={locale} />
      </main>
      <ImageModal locale={locale} />
      {hasTweetCards ? <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" /> : null}
    </>
  );
}
