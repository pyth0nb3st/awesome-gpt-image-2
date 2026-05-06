import Footer from "../Footer";
import { CardGrid } from "../GalleryCards";
import SiteNav from "../SiteNav";
import TwitterCreatorProfile from "../TwitterCreatorProfile";
import { absoluteUrl, humanizeTag, tagEntrySet } from "../../lib/gallery";
import { getCopy, tagLabel } from "../../lib/i18n";

export default function CreatorDetailPageContent({ creator, entries, locale = "en" }) {
  const t = getCopy(locale);
  const tags = [
    ...new Set(
      entries
        .flatMap((entry) => entry.tags)
        .filter((tag) => tagEntrySet.has(tag))
        .slice(0, 12),
    ),
  ];
  const title = creator.handle ? `${creator.name} ${creator.handle}` : creator.name;
  const description =
    locale === "zh"
      ? `${creator.name} 在本站收录了 ${entries.length} 个 GPT Image 2 prompt 示例，包含生成图、来源帖和可复用主题。`
      : `${creator.name} has ${entries.length} credited GPT Image 2 prompt example${entries.length === 1 ? "" : "s"} in this gallery, with generated images, source posts, and reusable topics.`;

  return (
    <main className="site-shell">
      <SiteNav locale={locale} path={`/creators/${creator.slug}/`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: title,
            url: absoluteUrl(locale === "zh" ? `zh/creators/${creator.slug}/` : `creators/${creator.slug}/`),
            description,
            mainEntity: {
              "@type": "Person",
              name: creator.name,
              alternateName: creator.handle || undefined,
              sameAs: creator.profileUrl || undefined,
            },
          }),
        }}
      />
      <header className="page-header creator-header">
        <p className="meta">{entries.length} credited examples</p>
        <h1 className="page-title">{title}</h1>
        <p className="lead">{description}</p>
        <TwitterCreatorProfile creator={creator} locale={locale} />
        {creator.profileUrl ? (
          <div className="twitter-timeline-shell">
            <a
              className="twitter-timeline"
              data-height="520"
              data-dnt="true"
              data-chrome="noheader nofooter noborders transparent"
              href={creator.profileUrl}
            >
              Posts by {creator.handle || creator.name}
            </a>
          </div>
        ) : null}
        {tags.length > 0 ? (
          <ul className="tags">
            {tags.map((tag) => (
              <li key={tag}>{tagLabel(tag, locale) || humanizeTag(tag)}</li>
            ))}
          </ul>
        ) : null}
      </header>
      <CardGrid entries={entries} locale={locale} />
      <Footer locale={locale} />
      {creator.profileUrl ? <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" /> : null}
    </main>
  );
}
