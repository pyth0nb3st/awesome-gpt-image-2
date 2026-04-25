import PromptsIndexPageContent from "../../components/pages/PromptsIndexPage";
import { galleryEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

const t = getCopy("en");

export const metadata = {
  title: t.promptsTitle,
  description: `Browse ${galleryEntries.length} GPT Image 2 examples with generated images, topics, prompt text, and related ideas.`,
  alternates: {
    canonical: "/prompts/",
    languages: {
      en: "/prompts/",
      zh: "/zh/prompts/",
    },
  },
};

export default function PromptsIndexPage() {
  return <PromptsIndexPageContent locale="en" />;
}
