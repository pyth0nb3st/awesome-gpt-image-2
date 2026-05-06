import CreatorsIndexPageContent from "../../../components/pages/CreatorsIndexPage";
import { creatorEntries } from "../../../lib/gallery";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../../lib/site-assets";

const description = `浏览 ${creatorEntries.length} 位公开分享 GPT Image 2 prompt 的 X/Twitter 创作者。`;

export const metadata = {
  title: "GPT Image 2 Prompt 创作者",
  description,
  alternates: {
    canonical: "/zh/creators/",
    languages: {
      en: "/creators/",
      zh: "/zh/creators/",
    },
  },
  openGraph: {
    ...openGraphBase("zh", "website"),
    title: "GPT Image 2 Prompt 创作者",
    description,
    url: "/zh/creators/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPT Image 2 Prompt 创作者",
    description,
    images: [SITE_OG_IMAGE],
  },
};

export default function ZhCreatorsIndexPage() {
  return <CreatorsIndexPageContent locale="zh" />;
}
