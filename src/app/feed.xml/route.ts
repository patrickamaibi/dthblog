import { POSTS, formatDate } from "@/lib/data";

const BASE_URL = "https://blog.discoverytechhub.com";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = POSTS.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>noreply@discoverytechhub.com (${escapeXml(post.author.name)})</author>
      <category>${escapeXml(post.category.title)}</category>
    </item>`).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DiscoveryTech Hub Blog</title>
    <link>${BASE_URL}</link>
    <description>Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.</description>
    <language>en-NG</language>
    <managingEditor>info@discoverytechhub.com (DiscoveryTech Hub)</managingEditor>
    <webMaster>info@discoverytechhub.com</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
