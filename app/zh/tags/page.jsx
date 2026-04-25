import TagsIndexPageContent from "../../../components/pages/TagsIndexPage";
import { getCopy } from "../../../lib/i18n";

const t = getCopy("zh");

export const metadata = {
  title: t.tagsTitle,
  description: t.tagsDescription,
  alternates: {
    canonical: "/zh/tags/",
    languages: {
      en: "/tags/",
      zh: "/zh/tags/",
    },
  },
};

export default function ZhTagsIndexPage() {
  return <TagsIndexPageContent locale="zh" />;
}
