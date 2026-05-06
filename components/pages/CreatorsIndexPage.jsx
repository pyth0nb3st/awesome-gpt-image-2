import Footer from "../Footer";
import SiteNav from "../SiteNav";
import TwitterCreatorProfile from "../TwitterCreatorProfile";
import { absoluteUrl, creatorEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

export default function CreatorsIndexPageContent({ locale = "en" }) {
  const t = getCopy(locale);
  const title = locale === "zh" ? "创作者" : "Creators";
  const description =
    locale === "zh"
      ? `浏览 ${creatorEntries.length} 位公开分享 GPT Image 2 prompt 的 X/Twitter 创作者。`
      : `Browse ${creatorEntries.length} X/Twitter creators whose public GPT Image 2 prompts are credited in this gallery.`;

  return (
    <main className="site-shell">
      <SiteNav locale={locale} path="/creators/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GPT Image 2 prompt creators",
            url: absoluteUrl(locale === "zh" ? "zh/creators/" : "creators/"),
            description,
            numberOfItems: creatorEntries.length,
          }),
        }}
      />
      <header className="page-header">
        <p className="meta">{creatorEntries.length} profiles</p>
        <h1 className="page-title">{title}</h1>
        <p className="lead">{description}</p>
      </header>
      <section className="creator-list" aria-label={title}>
        {creatorEntries.map((creator) => (
          <TwitterCreatorProfile creator={creator} locale={locale} key={creator.slug} />
        ))}
      </section>
      <Footer locale={locale} />
    </main>
  );
}
