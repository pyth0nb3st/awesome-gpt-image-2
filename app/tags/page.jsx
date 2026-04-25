import TagsIndexPageContent from "../../components/pages/TagsIndexPage";
import { tagEntries } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

const t = getCopy("en");

export const metadata = {
  title: t.tagsTitle,
  description: `Browse ${tagEntries.length} GPT Image 2 topic collections for UI mockups, product visuals, diagrams, games, storytelling, and evaluation workflows.`,
  alternates: {
    canonical: "/tags/",
    languages: {
      en: "/tags/",
      zh: "/zh/tags/",
    },
  },
};

export default function TagsIndexPage() {
  return <TagsIndexPageContent locale="en" />;
}
