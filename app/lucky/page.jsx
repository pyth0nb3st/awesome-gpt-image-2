import LuckyPageContent from "../../components/pages/LuckyPage";
import { galleryEntries, toSitePath } from "../../lib/gallery";
import { getCopy } from "../../lib/i18n";

const t = getCopy("en");

export const metadata = {
  title: t.luckyTitle,
  description: t.luckyDescription,
  alternates: {
    canonical: "/lucky/",
    languages: {
      en: "/lucky/",
      zh: "/zh/lucky/",
    },
  },
  openGraph: {
    title: t.luckyTitle,
    description: t.luckyDescription,
    url: "/lucky/",
    images: [toSitePath(galleryEntries[0].image.path)],
  },
  twitter: {
    card: "summary_large_image",
    title: t.luckyTitle,
    description: t.luckyDescription,
    images: [toSitePath(galleryEntries[0].image.path)],
  },
};

export default function LuckyPage() {
  return <LuckyPageContent locale="en" />;
}
