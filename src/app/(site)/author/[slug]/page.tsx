import Link from "next/link";
import { POSTS, CATEGORIES } from "@/lib/data";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Browse DiscoveryTech Hub articles by topic — AI & automation, branding, security, digital strategy, and ICT training.",
  alternates: {
    canonical: "https://blog.discoverytechhub.com/category",
  },
  openGraph: {
    title: "Topics | DiscoveryTech Hub Blog",
    description:
      "Browse DiscoveryTech Hub articles by topic — AI & automation, branding, security, digital strategy, and ICT training.",
    url: "https://blog.discoverytechhub.com/category",
    type: "website",
  },
};

// ── Category list page ──────────────────────────────────────
export default function CategoryIndex() {
  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to articles
        </Link>

        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Browse</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-white mb-3">Topics</h1>
        <p className="text-muted-foreground mb-12 max-w-xl">Everything we publish, organised by theme.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {CATEGORIES.map((cat) => {
            const count = POSTS.filter((p) => p.category.slug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative bg-card p-8 transition-colors hover:bg-accent/[0.03]"
              >
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
                <h2 className="text-lg font-bold text-primary dark:text-white group-hover:text-accent transition-colors mb-2">
                  {cat.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-accent">
                    {count} {count === 1 ? "article" : "articles"}
                  </p>
                  <ArrowRight className="w-3 h-3 text-accent transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}