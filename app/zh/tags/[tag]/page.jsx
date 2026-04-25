import { notFound } from "next/navigation";
import TagDetailPageContent from "../../../../components/pages/TagDetailPage";
import { getEntriesByTag, tagEntries, tagUrl } from "../../../../lib/gallery";
import { getCopy, tagLabel } from "../../../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../../../lib/site-assets";

export function generateStaticParams() {
  return tagEntries.map(([tag]) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) return {};

  const t = getCopy("zh");
  const label = tagLabel(tag, "zh");
  const description = t.tagDescription(entries.length, label);

  return {
    title: `${label} GPT Image 2 示例`,
    description,
    alternates: {
      canonical: `/zh${tagUrl(tag)}`,
      languages: {
        en: tagUrl(tag),
        zh: `/zh${tagUrl(tag)}`,
      },
    },
    openGraph: {
      ...openGraphBase("zh", "website"),
      title: `${label} GPT Image 2 示例`,
      description,
      url: `/zh${tagUrl(tag)}`,
      images: [SITE_OG_IMAGE_METADATA],
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} GPT Image 2 示例`,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default async function ZhTagPage({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) notFound();

  return <TagDetailPageContent tag={tag} entries={entries} locale="zh" />;
}
