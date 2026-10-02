import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/sanity/lib/queries";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { buildMetadata } from "@/components/Seo";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

type PageParams = { slug: string };

async function getTagData(slug: string) {
  const posts = await getAllPosts();
  const matching = posts.filter((p) => p.tags?.some((t) => t.slug === slug));
  const tag = matching[0]?.tags?.find((t) => t.slug === slug);
  return { tag, posts: matching };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const slugs = new Set<string>();
  for (const p of posts) {
    for (const t of p.tags ?? []) {
      if (t.slug) slugs.add(t.slug);
    }
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { tag } = await getTagData(slug);
  if (!tag) return {};

  // Tag archives are thin: keep them out of search results but let crawlers follow the links
  return buildMetadata({
    title: `${tag.title} articles`,
    description: `Articles tagged ${tag.title} on the DiscoveryTech Hub Blog.`,
    path: `/tag/${slug}`,
    index: false,
    follow: true,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const { tag, posts } = await getTagData(slug);
  if (!tag) notFound();

  return (
    // The site layout already provides the <main> element
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-3">Tag</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-white mb-10">
          #{tag.title}
        </h1>

        <div className="space-y-0">
          {posts.length === 0 && (
            <p className="text-muted-foreground font-mono text-sm">No articles tagged #{tag.title} yet.</p>
          )}
          {posts.map((post, i) => (
            <article key={post.slug} className={`group py-8 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-3 text-xs mb-3">
                {post.category?.slug && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="rounded-full bg-slate-100 dark:bg-gray-800 px-3 py-1 font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                  >
                    {post.category.title}
                  </Link>
                )}
                <time className="font-mono text-muted-foreground">{formatDate(post.publishedAt)}</time>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white group-hover:text-accent transition-colors leading-snug mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
