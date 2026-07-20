import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, TAGS, formatDate } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return Object.values(TAGS).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tag = Object.values(TAGS).find((t) => t.slug === params.slug);
  if (!tag) return {};
  return { title: `#${tag.title} — DiscoveryTech Hub Blog` };
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const tag = Object.values(TAGS).find((t) => t.slug === params.slug);
  if (!tag) notFound();
  const posts = POSTS.filter((p) => p.tags.some((t) => t.slug === tag.slug));

  return (
    <main className="pt-28 pb-24 min-h-screen">
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
                <Link
                  href={`/category/${post.category.slug}`}
                  className="rounded-full bg-slate-100 dark:bg-gray-800 px-3 py-1 font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                >
                  {post.category.title}
                </Link>
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
    </main>
  );
}
