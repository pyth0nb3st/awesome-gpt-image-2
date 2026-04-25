import { notFound } from "next/navigation";
import TagDetailPageContent from "../../../components/pages/TagDetailPage";
import { getEntriesByTag, tagEntries, tagUrl } from "../../../lib/gallery";
import { tagLabel } from "../../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../../lib/site-assets";

export function generateStaticParams() {
  return tagEntries.map(([tag]) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) return {};

  const label = tagLabel(tag, "en");
  const description = `Browse ${entries.length} GPT Image 2 examples about ${label.toLowerCase()}, including generated images, prompt text, and related ideas.`;

  return {
    title: `${label} GPT Image 2 Examples`,
    description,
    alternates: {
      canonical: tagUrl(tag),
      languages: {
        en: tagUrl(tag),
        zh: `/zh${tagUrl(tag)}`,
      },
    },
    openGraph: {
      ...openGraphBase("en", "website"),
      title: `${label} GPT Image 2 Examples`,
      description,
      url: tagUrl(tag),
      images: [SITE_OG_IMAGE_METADATA],
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} GPT Image 2 Examples`,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) notFound();

  return <TagDetailPageContent tag={tag} entries={entries} locale="en" />;
}
