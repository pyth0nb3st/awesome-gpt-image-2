import "./globals.css";
import { SITE_URL } from "../lib/gallery";
import { getCopy } from "../lib/i18n";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA } from "../lib/site-assets";

const t = getCopy("en");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t.homeTitle,
    template: "%s | Awesome GPT Image 2",
  },
  description: t.homeDescription,
  authors: [{ name: "pyth0nb3st" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Awesome GPT Image 2",
    title: t.homeTitle,
    description: t.homeDescription,
    url: SITE_URL,
    images: [SITE_OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: t.homeTitle,
    description: t.homeDescription,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 180,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
