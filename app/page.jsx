import HomePageContent from "../components/pages/HomePage";
import { getCopy } from "../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA } from "../lib/site-assets";

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
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.homeTitle,
    description: t.homeDescription,
    images: [SITE_OG_IMAGE],
  },
};

export default function HomePage() {
  return <HomePageContent locale="en" />;
}
