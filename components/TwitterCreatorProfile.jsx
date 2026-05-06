import { localizedCreatorUrl } from "../lib/gallery";

export default function TwitterCreatorProfile({ creator, locale = "en" }) {
  if (!creator) return null;

  const initial = (creator.handle || creator.name || "?").replace(/^@/, "").slice(0, 1).toUpperCase();
  const localLabel = locale === "zh" ? "查看创作者页" : "View creator page";
  const xLabel = locale === "zh" ? "打开 X 主页" : "Open X profile";
  const countLabel = locale === "zh" ? `${creator.count} 个收录示例` : `${creator.count} saved example${creator.count === 1 ? "" : "s"}`;

  return (
    <article className="twitter-profile-card">
      <div className="twitter-profile-avatar" aria-hidden="true">
        {initial}
      </div>
      <div className="twitter-profile-body">
        <strong>{creator.name}</strong>
        {creator.handle ? <span>{creator.handle}</span> : null}
        <em>{countLabel}</em>
      </div>
      <div className="twitter-profile-actions">
        <a href={localizedCreatorUrl(creator.slug, locale)}>{localLabel}</a>
        {creator.profileUrl ? (
          <a href={creator.profileUrl} target="_blank" rel="noreferrer">
            {xLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
