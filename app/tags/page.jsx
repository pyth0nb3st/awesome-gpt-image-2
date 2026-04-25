import TagsIndexPageContent from "../../components/pages/TagsIndexPage";
import { tagEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../lib/site-assets";

const t = getCopy("en");
const description = `Browse ${tagEntries.length} GPT Image 2 topic collections for UI mockups, product visuals, diagrams, games, storytelling, and evaluation workflows.`;

export const metadata = {
  title: t.tagsTitle,
  description,
  alternates: {
    canonical: "/tags/",
    languages: {
      en: "/tags/",
      zh: "/zh/tags/",
    },
  },
  openGraph: {
    ...openGraphBase("en", "website"),
    title: t.tagsTitle,
    description,
    url: "/tags/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.tagsTitle,
    description,
    images: [SITE_OG_IMAGE],
  },
};

export default function TagsIndexPage() {
  return <TagsIndexPageContent locale="en" />;
}
