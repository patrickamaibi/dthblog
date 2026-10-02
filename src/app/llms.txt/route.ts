import { getAllPosts, getAllCategories } from "@/sanity/lib/queries";

export const revalidate = 3600;

const BASE = "https://blog.discoverytechhub.com";

function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function GET() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  const lines: string[] = [
    "# DiscoveryTech Hub Blog",
    "",
    "> Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa. Published by DiscoveryTech Hub, an ICT training and digital transformation company.",
    "",
    "## Topics",
    ...categories.map((c) => `- [${c.title}](${BASE}/category/${c.slug})`),
    "",
    "## Articles",
    ...posts
      .slice(0, 100)
      .map(
        (p) =>
          `- [${p.title}](${BASE}/blog/${p.slug})${
            p.excerpt ? `: ${oneLine(p.excerpt)}` : ""
          }`
      ),
    "",
    "## More",
    `- [About](${BASE}/about)`,
    `- [RSS feed](${BASE}/feed.xml)`,
    "- [DiscoveryTech Hub main site](https://discoverytechhub.com)",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
