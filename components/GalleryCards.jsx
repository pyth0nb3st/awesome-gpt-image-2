import Image from "next/image";
import {
  imageUrl,
  localizedPromptUrl,
  localizedTagUrl,
  promptExcerpt,
  tagEntrySet,
  thumbnailDimensions,
  thumbnailUrl,
} from "../lib/gallery";
import { getCopy, tagLabel } from "../lib/i18n";

const GALLERY_IMAGE_SIZES = "(max-width: 680px) calc(100vw - 20px), (max-width: 980px) calc((100vw - 50px) / 2), 402px";

function GalleryImage({ entry, alt, defer = false }) {
  const { image, index } = entry;
  const thumb = thumbnailUrl(image);
  const dimensions = thumbnailDimensions(image);

  if (defer) {
    return (
      <img
        data-src={thumb}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={thumb}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      sizes={GALLERY_IMAGE_SIZES}
      preload={index === 0}
      loading={index === 0 ? undefined : index < 3 ? "eager" : "lazy"}
      fetchPriority={index === 0 ? "high" : undefined}
    />
  );
}

export function GalleryCard({ entry, defer = false, locale = "en" }) {
  const t = getCopy(locale);
  const { image, index, search, tags, title } = entry;
  const tagLabels = tags.map((tag) => tagLabel(tag, locale));
  const alt = t.cardAlt(title, tagLabels);

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
        <GalleryImage entry={entry} alt={alt} defer={defer} />
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
            <Image
              src={thumbnailUrl(entry.image)}
              alt={t.exampleAlt(entry.title)}
              loading="lazy"
              width={thumbnailDimensions(entry.image).width}
              height={thumbnailDimensions(entry.image).height}
              sizes={GALLERY_IMAGE_SIZES}
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
