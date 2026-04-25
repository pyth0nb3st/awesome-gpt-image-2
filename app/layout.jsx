import "./globals.css";
import { SITE_URL } from "../lib/gallery";
import { getCopy } from "../lib/i18n";

const t = getCopy("en");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t.homeTitle,
    template: "%s | Awesome GPT Image 2",
  },
  description: t.homeDescription,
  authors: [{ name: "pyth0nb3st" }],
  openGraph: {
    type: "website",
    siteName: "Awesome GPT Image 2",
    title: t.homeTitle,
    description: t.homeDescription,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: t.homeTitle,
    description: t.homeDescription,
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
