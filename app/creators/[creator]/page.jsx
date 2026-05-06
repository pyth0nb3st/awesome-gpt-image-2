import { notFound } from "next/navigation";
import CreatorDetailPageContent from "../../../components/pages/CreatorDetailPage";
import { creatorEntries, creatorUrl, getCreatorBySlug, getEntriesByCreator, thumbnailUrl } from "../../../lib/gallery";
import { openGraphBase } from "../../../lib/site-assets";

export function generateStaticParams() {
  return creatorEntries.map((creator) => ({ creator: creator.slug }));
}

export async function generateMetadata({ params }) {
  const { creator: slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) return {};

  const description = `${creator.name} has ${creator.count} credited GPT Image 2 prompt example${creator.count === 1 ? "" : "s"} in this gallery.`;
  const image = creator.entries[0]?.image;

  return {
    title: `${creator.name} GPT Image 2 Prompts`,
    description,
    alternates: {
      canonical: creatorUrl(creator.slug),
      languages: {
        en: creatorUrl(creator.slug),
        zh: `/zh${creatorUrl(creator.slug)}`,
      },
    },
    openGraph: {
      ...openGraphBase("en", "profile"),
      title: `${creator.name} GPT Image 2 Prompts`,
      description,
      url: creatorUrl(creator.slug),
      images: image ? [thumbnailUrl(image)] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${creator.name} GPT Image 2 Prompts`,
      description,
      images: image ? [thumbnailUrl(image)] : undefined,
    },
  };
}

export default async function CreatorPage({ params }) {
  const { creator: slug } = await params;
  const creator = getCreatorBySlug(slug);
  const entries = getEntriesByCreator(slug);
  if (!creator || entries.length === 0) notFound();

  return <CreatorDetailPageContent creator={creator} entries={entries} locale="en" />;
}
