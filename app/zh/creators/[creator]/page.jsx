import { notFound } from "next/navigation";
import CreatorDetailPageContent from "../../../../components/pages/CreatorDetailPage";
import { creatorEntries, creatorUrl, getCreatorBySlug, getEntriesByCreator, thumbnailUrl } from "../../../../lib/gallery";
import { openGraphBase } from "../../../../lib/site-assets";

export function generateStaticParams() {
  return creatorEntries.map((creator) => ({ creator: creator.slug }));
}

export async function generateMetadata({ params }) {
  const { creator: slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) return {};

  const description = `${creator.name} 在本站收录了 ${creator.count} 个 GPT Image 2 prompt 示例。`;
  const image = creator.entries[0]?.image;

  return {
    title: `${creator.name} GPT Image 2 Prompt 示例`,
    description,
    alternates: {
      canonical: `/zh${creatorUrl(creator.slug)}`,
      languages: {
        en: creatorUrl(creator.slug),
        zh: `/zh${creatorUrl(creator.slug)}`,
      },
    },
    openGraph: {
      ...openGraphBase("zh", "profile"),
      title: `${creator.name} GPT Image 2 Prompt 示例`,
      description,
      url: `/zh${creatorUrl(creator.slug)}`,
      images: image ? [thumbnailUrl(image)] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${creator.name} GPT Image 2 Prompt 示例`,
      description,
      images: image ? [thumbnailUrl(image)] : undefined,
    },
  };
}

export default async function ZhCreatorPage({ params }) {
  const { creator: slug } = await params;
  const creator = getCreatorBySlug(slug);
  const entries = getEntriesByCreator(slug);
  if (!creator || entries.length === 0) notFound();

  return <CreatorDetailPageContent creator={creator} entries={entries} locale="zh" />;
}
