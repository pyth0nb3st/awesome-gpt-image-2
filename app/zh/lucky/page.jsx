import LuckyPageContent from "../../../components/pages/LuckyPage";
import { getCopy } from "../../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../../lib/site-assets";

const t = getCopy("zh");

export const metadata = {
  title: t.luckyTitle,
  description: t.luckyDescription,
  alternates: {
    canonical: "/zh/lucky/",
    languages: {
      en: "/lucky/",
      zh: "/zh/lucky/",
    },
  },
  openGraph: {
    ...openGraphBase("zh", "website"),
    title: t.luckyTitle,
    description: t.luckyDescription,
    url: "/zh/lucky/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.luckyTitle,
    description: t.luckyDescription,
    images: [SITE_OG_IMAGE],
  },
};

export default function ZhLuckyPage() {
  return <LuckyPageContent locale="zh" />;
}
