export const SITE_NAME = "Awesome GPT Image 2";
export const SITE_OG_IMAGE = "/opengraph-image.png";
export const SITE_OG_IMAGE_ALT = "Awesome GPT Image 2 prompt gallery preview";
export const SITE_OG_IMAGE_METADATA = {
  url: SITE_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: SITE_OG_IMAGE_ALT,
};

export function openGraphBase(locale = "en", type = "website") {
  return {
    type,
    siteName: SITE_NAME,
    locale: locale === "zh" ? "zh_CN" : "en_US",
  };
}
