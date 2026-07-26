import Link from "next/link";
import { POSTS, CATEGORIES } from "../../lib/data";
import { ArrowRight, Bot, Palette, ShieldCheck, Compass, GraduationCap, Folder } from "lucide-react";
import type { Metadata } from "next";

// Kept in sync with the icon map used on the homepage category cards
// and the individual /category/[slug] page.
const CATEGORY_ICONS: Record<string, typeof Folder> = {
  ai: Bot,
  design: Palette,
  security: ShieldCheck,
  strategy: Compass,
  education: GraduationCap,
};

export const metadata: Metadata = {
  title: "Topics — DiscoveryTech Hub Blog",
  description: "Every subject we write about, from AI and product design to security and strategy.",
  alternates: {
    canonical: "https://blog.discoverytechhub.com/category",
  },
};

export default function CategoryIndexPage() {
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, POSTS.filter((p) => p.category.slug === c.slug).length])
  );

  return (
    <>
      <div className="relative w-full overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 bg-primary dark:bg-[#0A1F44]">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1A4FD6]/40 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-[#0A1F44]/60 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest uppercase text-white/70 mb-5">
            <span className="text-accent">§</span> Browse
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] max-w-2xl">
            Topics
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
            Every subject we cover, from applied AI to the strategy behind it.
          </p>
        </div>
      </div>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="pt-16 md:pt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category, i) => {
              const Icon = CATEGORY_ICONS[category.slug] ?? Folder;
              const count = counts[category.slug] ?? 0;

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="dth-fade-in-up opacity-0 group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30 overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/[0.06] to-transparent" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/15 border border-accent/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/30">
                      <Icon className="w-5 h-5 text-accent transition-colors duration-300 group-hover:text-white" />
                    </div>

                    <h2 className="text-xl font-bold text-primary dark:text-white leading-snug group-hover:text-accent transition-colors">
                      {category.title}
                    </h2>

                    {category.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground tracking-wide">
                        {count} {count === 1 ? "article" : "articles"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                        Explore <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}