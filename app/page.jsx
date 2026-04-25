import HomePageContent from "../components/pages/HomePage";
import { galleryEntries, toSitePath } from "../lib/gallery";
import { getCopy } from "../lib/i18n";

const t = getCopy("en");

export const metadata = {
  title: t.homeTitle,
  description: t.homeDescription,
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      zh: "/zh/",
    },
  },
  openGraph: {
    title: t.homeTitle,
    description: t.homeDescription,
    url: "/",
    images: [toSitePath(galleryEntries[0].image.path)],
  },
  twitter: {
    card: "summary_large_image",
    title: t.homeTitle,
    description: t.homeDescription,
    images: [toSitePath(galleryEntries[0].image.path)],
  },
};

export default function HomePage() {
  return <HomePageContent locale="en" />;
}
