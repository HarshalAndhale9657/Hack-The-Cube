import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

/**
 * Generate metadata for a specific page
 */
export function createMetadata({
  title,
  description,
  path = "",
  ogImage,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}`;

  return {
    // Bare page title — the root layout's title template appends the site name.
    // (OG/Twitter titles are not templated, so they use the full form.)
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
