import { imageUrl, promptExcerpt, promptUrl, tagEntrySet, tagUrl } from "../lib/gallery";

export function GalleryCard({ entry, defer = false }) {
  const { image, index, search, tags, title } = entry;
  const imgProps = defer ? { "data-src": imageUrl(image) } : { src: imageUrl(image) };

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
        aria-label={`Open image preview for ${title}`}
      >
        <img
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          alt={`${title}. Tags: ${tags.join(", ")}.`}
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
          <a className="title-link" href={promptUrl(entry)}>
            {title}
          </a>
        </h2>
        <p className="caption">{image.caption}</p>
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>
              {tagEntrySet.has(tag) ? <a href={tagUrl(tag)}>{tag}</a> : tag}
            </li>
          ))}
        </ul>
        <a className="detail-link" href={promptUrl(entry)}>
          Open prompt SEO page
        </a>
        <details>
          <summary>Prompt</summary>
          <pre>{image.prompt}</pre>
        </details>
      </div>
    </article>
  );
}

export function CardGrid({ entries }) {
  return (
    <div className="grid">
      {entries.map((entry) => (
        <article className="card" key={entry.pagePath}>
          <a href={promptUrl(entry)}>
            <img
              src={imageUrl(entry.image)}
              alt={`${entry.title}. GPT Image 2 prompt example.`}
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
