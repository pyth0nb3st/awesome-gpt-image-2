import PromptsIndexPageContent from "../../../components/pages/PromptsIndexPage";
import { getCopy } from "../../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA } from "../../../lib/site-assets";

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
  openGraph: {
    title: t.promptsTitle,
    description: t.promptsDescription,
    url: "/zh/prompts/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.promptsTitle,
    description: t.promptsDescription,
    images: [SITE_OG_IMAGE],
  },
};

export default function ZhPromptsIndexPage() {
  return <PromptsIndexPageContent locale="zh" />;
}
