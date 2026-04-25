import PromptsIndexPageContent from "../../../components/pages/PromptsIndexPage";
import { getCopy } from "../../../lib/i18n";

const t = getCopy("zh");

export const metadata = {
  title: t.promptsTitle,
  description: t.promptsDescription,
  alternates: {
    canonical: "/zh/prompts/",
    languages: {
      en: "/prompts/",
      zh: "/zh/prompts/",
    },
  },
};

export default function ZhPromptsIndexPage() {
  return <PromptsIndexPageContent locale="zh" />;
}
