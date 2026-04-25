import PromptsIndexPageContent from "../../components/pages/PromptsIndexPage";
import { galleryEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../lib/site-assets";

const t = getCopy("en");
const description = `Browse ${galleryEntries.length} GPT Image 2 examples with generated images, topics, prompt text, and related ideas.`;

export const metadata = {
  title: t.promptsTitle,
  description,
  alternates: {
    canonical: "/prompts/",
    languages: {
      en: "/prompts/",
      zh: "/zh/prompts/",
    },
  },
  openGraph: {
    ...openGraphBase("en", "website"),
    title: t.promptsTitle,
    description,
    url: "/prompts/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.promptsTitle,
    description,
    images: [SITE_OG_IMAGE],
  },
};

export default function PromptsIndexPage() {
  return <PromptsIndexPageContent locale="en" />;
}
