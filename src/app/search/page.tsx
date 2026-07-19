"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { POSTS, formatDate } from "@/lib/data";
import { Search } from "lucide-react";

const fuse = new Fuse(POSTS, {
  keys: ["title", "excerpt", "content", "category.title", "author.name", "tags.title"],
  threshold: 0.35,
  includeScore: true,
});

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return POSTS.slice(0, 6);
    return fuse.search(query).map((r) => r.item);
  }, [query]);

  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Search</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-white mb-10">
          Find an article
        </h1>

        {/* Search input */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            id="search-input"
            placeholder="Search by title, topic, or author…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-4 text-base border border-border rounded-xl bg-card text-primary dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>

        {/* Results */}
        <p className="font-mono text-xs text-muted-foreground mb-8 tracking-wide">
          {query ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : "Browse all"}
        </p>

        <div className="space-y-0">
          {results.length === 0 && (
            <p className="text-muted-foreground font-mono text-sm py-8">No articles match that search.</p>
          )}
          {results.map((post, i) => (
            <article key={post.slug} className={`group py-8 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-3 text-xs mb-3">
                <Link
                  href={`/category/${post.category.slug}`}
                  className="rounded-full bg-slate-100 dark:bg-gray-800 px-3 py-1 font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                >
                  {post.category.title}
                </Link>
                <time className="font-mono text-muted-foreground">{formatDate(post.publishedAt)}</time>
                <span className="font-mono text-muted-foreground">{post.readTime} min read</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white group-hover:text-accent transition-colors leading-snug mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <Link href={`/author/${post.author.slug}`} className="mt-3 inline-block text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                {post.author.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
