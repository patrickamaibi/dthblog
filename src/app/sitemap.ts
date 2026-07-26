import { getAllPosts, getAllCategories } from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://blog.discoverytechhub.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/category`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // getAllPosts() already merges Sanity + static posts, deduped by slug
  const posts = await getAllPosts();

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // getAllCategories() already merges Sanity + static categories, sorted by order
  const categories = await getAllCategories();

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // No getAllAuthors() exists — authors only live nested inside posts,
  // so derive unique authors from the merged post list instead
  const authorMap = new Map<string, string>(); // slug -> slug (dedup)
  for (const p of posts) {
    if (p.author?.slug) authorMap.set(p.author.slug, p.author.slug);
  }

  const authorPages: MetadataRoute.Sitemap = Array.from(authorMap.keys()).map((slug) => ({
    url: `${base}/author/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...authorPages];
}