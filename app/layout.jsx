import "./globals.css";
import { SITE_URL, seoDescription } from "../lib/gallery";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Awesome GPT Image 2 Prompts & Use Cases Gallery",
    template: "%s | Awesome GPT Image 2",
  },
  description: seoDescription,
  authors: [{ name: "pyth0nb3st" }],
  openGraph: {
    type: "website",
    siteName: "Awesome GPT Image 2",
    title: "Awesome GPT Image 2 Prompts & Use Cases",
    description: seoDescription,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Awesome GPT Image 2 Prompts & Use Cases",
    description: seoDescription,
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
