import { notFound } from "next/navigation";
import TagDetailPageContent from "../../../../components/pages/TagDetailPage";
import { getEntriesByTag, humanizeTag, tagEntries, tagUrl } from "../../../../lib/gallery";
import { getCopy } from "../../../../lib/i18n";

export function generateStaticParams() {
  return tagEntries.map(([tag]) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) return {};

  const t = getCopy("zh");
  const label = humanizeTag(tag);
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
      title: `${label} GPT Image 2 示例`,
      description,
      url: `/zh${tagUrl(tag)}`,
    },
  };
}

export default async function ZhTagPage({ params }) {
  const { tag } = await params;
  const entries = getEntriesByTag(tag);
  if (entries.length === 0) notFound();

  return <TagDetailPageContent tag={tag} entries={entries} locale="zh" />;
}
