// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://blog.discoverytechhub.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/Y"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}