import { getAllPosts } from "@/sanity/lib/queries";

export const revalidate = 3600;

const BASE_URL = "https://blog.discoverytechhub.com";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET() {
  // getAllPosts() merges Sanity + static posts, so the feed matches the site
  const posts = (await getAllPosts()).slice(0, 50);

  const dates = posts
    .map((p) => toDate(p.updatedAt) ?? toDate(p.publishedAt))
    .filter((d): d is Date => d instanceof Date);
  const lastBuild = dates.length
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : new Date();

  const items = posts
    .map((post) => {
      const pub = toDate(post.publishedAt);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt ?? "")}</description>${
        pub ? `\n      <pubDate>${pub.toUTCString()}</pubDate>` : ""
      }
      <author>noreply@discoverytechhub.com (${escapeXml(post.author?.name ?? "DiscoveryTech Hub")})</author>${
        post.category?.title
          ? `\n      <category>${escapeXml(post.category.title)}</category>`
          : ""
      }
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DiscoveryTech Hub Blog</title>
    <link>${BASE_URL}</link>
    <description>Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.</description>
    <language>en-NG</language>
    <managingEditor>info@discoverytechhub.com (DiscoveryTech Hub)</managingEditor>
    <webMaster>info@discoverytechhub.com</webMaster>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
