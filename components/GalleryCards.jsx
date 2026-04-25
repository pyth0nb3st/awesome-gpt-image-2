import { imageUrl, localizedPromptUrl, localizedTagUrl, promptExcerpt, tagEntrySet } from "../lib/gallery";
import { getCopy, tagLabel } from "../lib/i18n";

export function GalleryCard({ entry, defer = false, locale = "en" }) {
  const t = getCopy(locale);
  const { image, index, search, tags, title } = entry;
  const imgProps = defer ? { "data-src": imageUrl(image) } : { src: imageUrl(image) };
  const tagLabels = tags.map((tag) => tagLabel(tag, locale));

  return (
    <article
      className={`card${defer ? " is-deferred" : ""}`}
      id={`prompt-${index + 1}`}
      data-search={search}
      data-tags={tags.join(" ")}
    >
      <a
        className="image-link"
        href={imageUrl(image)}
        data-modal-image
        data-title={title}
        data-caption={image.caption}
        aria-label={t.openPreview(title)}
      >
        <img
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          alt={t.cardAlt(title, tagLabels)}
          width={image.width}
          height={image.height}
          {...imgProps}
        />
      </a>
      <div className="content">
        <div className="eyebrow">
          #{String(index + 1).padStart(2, "0")} · {image.createdAt ?? "historical"}
        </div>
        <h2>
          <a className="title-link" href={localizedPromptUrl(entry, locale)}>
            {title}
          </a>
        </h2>
        <p className="caption">{image.caption}</p>
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>
              {tagEntrySet.has(tag) ? <a href={localizedTagUrl(tag, locale)}>{tagLabel(tag, locale)}</a> : tagLabel(tag, locale)}
            </li>
          ))}
        </ul>
        <a className="detail-link" href={localizedPromptUrl(entry, locale)}>
          {t.viewDetails}
        </a>
        <details>
          <summary>{t.promptText}</summary>
          <pre>{image.prompt}</pre>
        </details>
      </div>
    </article>
  );
}

export function CardGrid({ entries, locale = "en" }) {
  const t = getCopy(locale);

  return (
    <div className="grid">
      {entries.map((entry) => (
        <article className="card" key={entry.pagePath}>
          <a href={localizedPromptUrl(entry, locale)}>
            <img
              src={imageUrl(entry.image)}
              alt={t.exampleAlt(entry.title)}
              loading="lazy"
              width={entry.image.width}
              height={entry.image.height}
            />
            <div className="content">
              <h2>{entry.title}</h2>
              <p>{promptExcerpt(entry.image.prompt, 130)}</p>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
