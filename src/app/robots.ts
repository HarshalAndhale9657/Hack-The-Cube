import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Server actions live under /register; there are no private routes to block yet.
      disallow: [],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
