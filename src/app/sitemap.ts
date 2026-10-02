import { getAllPosts, getAllCategories } from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE = "https://blog.discoverytechhub.com";

function toDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function latest(dates: (Date | undefined)[]): Date | undefined {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return undefined;
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getAllPosts() already merges Sanity + static posts, deduped by slug
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  const postDate = (p: (typeof posts)[number]) =>
    toDate(p.updatedAt) ?? toDate(p.publishedAt);

  const newestPost = latest(posts.map(postDate));

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: newestPost },
    { url: `${BASE}/category`, lastModified: newestPost },
    // /about has no reliable modified date, so none is given. A missing
    // lastmod is better than a fake one.
    { url: `${BASE}/about` },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: postDate(p),
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: latest(
      posts.filter((p) => p.category?.slug === c.slug).map(postDate)
    ),
  }));

  // Authors only live nested inside posts, so derive them from the post list
  const authorDates = new Map<string, Date | undefined>();
  for (const p of posts) {
    const slug = p.author?.slug;
    if (!slug) continue;
    authorDates.set(slug, latest([authorDates.get(slug), postDate(p)]));
  }

  const authorPages: MetadataRoute.Sitemap = Array.from(authorDates.entries()).map(
    ([slug, lastModified]) => ({
      url: `${BASE}/author/${slug}`,
      lastModified,
    })
  );

  return [...pages, ...postPages, ...categoryPages, ...authorPages];
}
