import { POSTS, CATEGORIES, AUTHORS } from "@/lib/data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://blog.discoverytechhub.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/category`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const postPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const authorPages: MetadataRoute.Sitemap = AUTHORS.map((a) => ({
    url: `${base}/author/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...authorPages];
}
