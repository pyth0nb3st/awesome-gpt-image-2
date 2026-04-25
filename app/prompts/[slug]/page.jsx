import { notFound } from "next/navigation";
import PromptDetailPageContent from "../../../components/pages/PromptDetailPage";
import { galleryEntries, getEntryBySlug, imageUrl, promptExcerpt } from "../../../lib/gallery";
import { tagLabel } from "../../../lib/i18n";

export function generateStaticParams() {
  return galleryEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  const description = promptExcerpt(
    `${entry.title}. GPT Image 2 example with generated image, topics ${entry.tags.map((tag) => tagLabel(tag, "en")).join(", ")}, and reusable prompt structure.`,
    158,
  );

  return {
    title: `${entry.title} | GPT Image 2 Example`,
    description,
    alternates: {
      canonical: `/${entry.pagePath}`,
      languages: {
        en: `/${entry.pagePath}`,
        zh: `/zh/${entry.pagePath}`,
      },
    },
    openGraph: {
      title: `${entry.title} | GPT Image 2 Example`,
      description,
      url: `/${entry.pagePath}`,
      images: [imageUrl(entry.image)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | GPT Image 2 Example`,
      description,
      images: [imageUrl(entry.image)],
    },
  };
}

export default async function PromptPage({ params }) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  return <PromptDetailPageContent entry={entry} locale="en" />;
}
