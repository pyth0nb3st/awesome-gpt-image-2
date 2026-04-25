import TagsIndexPageContent from "../../../components/pages/TagsIndexPage";
import { getCopy } from "../../../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA } from "../../../lib/site-assets";

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
  openGraph: {
    title: t.tagsTitle,
    description: t.tagsDescription,
    url: "/zh/tags/",
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.tagsTitle,
    description: t.tagsDescription,
    images: [SITE_OG_IMAGE],
  },
};

export default function ZhTagsIndexPage() {
  return <TagsIndexPageContent locale="zh" />;
}
