import { notFound } from "next/navigation";
import PromptDetailPageContent from "../../../../components/pages/PromptDetailPage";
import { galleryEntries, getEntryBySlug, imageUrl, promptExcerpt } from "../../../../lib/gallery";

export function generateStaticParams() {
  return galleryEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  const description = promptExcerpt(`${entry.title}。GPT Image 2 示例，包含生成图、主题和完整提示词。`, 158);

  return {
    title: `${entry.title} | GPT Image 2 示例`,
    description,
    alternates: {
      canonical: `/zh/${entry.pagePath}`,
      languages: {
        en: `/${entry.pagePath}`,
        zh: `/zh/${entry.pagePath}`,
      },
    },
    openGraph: {
      title: `${entry.title} | GPT Image 2 示例`,
      description,
      url: `/zh/${entry.pagePath}`,
      images: [imageUrl(entry.image)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | GPT Image 2 示例`,
      description,
      images: [imageUrl(entry.image)],
    },
  };
}

export default async function ZhPromptPage({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  return <PromptDetailPageContent entry={entry} locale="zh" />;
}
