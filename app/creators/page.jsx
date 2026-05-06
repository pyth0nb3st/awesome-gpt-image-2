import CreatorsIndexPageContent from "../../components/pages/CreatorsIndexPage";
import { creatorEntries } from "../../lib/gallery";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../../lib/site-assets";

const description = `Browse ${creatorEntries.length} X/Twitter creators whose public GPT Image 2 prompts are credited in this gallery.`;

export const metadata = {
  title: "GPT Image 2 Prompt Creators",
  description,
  alternates: {
    canonical: "/creators/",
    languages: {
      en: "/creators/",
      zh: "/zh/creators/",
    },
  },
  openGraph: {
    ...openGraphBase("en", "website"),
    title: "GPT Image 2 Prompt Creators",
    description,
    url: "/creators/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPT Image 2 Prompt Creators",
    description,
    images: [SITE_OG_IMAGE],
  },
};

export default function CreatorsIndexPage() {
  return <CreatorsIndexPageContent locale="en" />;
}
