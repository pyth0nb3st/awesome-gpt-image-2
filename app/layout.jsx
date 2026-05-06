import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "../lib/gallery";
import { getCopy } from "../lib/i18n";
import { SITE_NAME, SITE_OG_IMAGE, SITE_OG_IMAGE_METADATA, openGraphBase } from "../lib/site-assets";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

const t = getCopy("en");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t.homeTitle,
    template: `%s | ${SITE_NAME}`,
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
    ...openGraphBase("en", "website"),
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
    <html lang="en" className={`${fraunces.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
