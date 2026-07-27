import Link from "next/link";
import Image from "next/image";
import { getAllCategories, getAllPosts } from "@/sanity/lib/queries";
import {
  ArrowRight,
  Bot,
  Palette,
  ShieldCheck,
  Compass,
  GraduationCap,
  Blocks,
  Sparkles,
  Folder,
} from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

// Kept in sync with ArticleGrid.tsx and /category/[slug]/page.tsx,
// slugs match the real Category.slug values.
const CATEGORY_ICONS: Record<string, typeof Folder> = {
  "ai-automation": Bot,
  branding: Palette,
  security: ShieldCheck,
  "digital-strategy": Compass,
  "ict-training": GraduationCap,
  web3: Blocks,
  others: Sparkles,
};

export const metadata: Metadata = {
  title: "Topics, DiscoveryTech Hub Blog",
  description: "Every subject we write about, from AI and product design to security and strategy.",
  alternates: {
    canonical: "https://blog.discoverytechhub.com/category",
  },
};

// Hand-placed node positions and edges (percentages of the hero box),
// deliberately fixed rather than randomized so the mesh reads as designed.
const MESH_NODES = [
  { x: 8, y: 22 }, { x: 22, y: 55 }, { x: 15, y: 82 },
  { x: 38, y: 15 }, { x: 42, y: 48 }, { x: 35, y: 78 },
  { x: 58, y: 30 }, { x: 62, y: 65 }, { x: 78, y: 18 },
  { x: 82, y: 50 }, { x: 90, y: 78 }, { x: 68, y: 88 },
];

const MESH_EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 5], [4, 5],
  [4, 6], [5, 7], [6, 7], [6, 8], [7, 9], [8, 9], [9, 10],
  [7, 11], [10, 11],
];

function HeroMesh() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full opacity-40 dark:opacity-30"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {MESH_EDGES.map(([a, b], i) => {
        const from = MESH_NODES[a];
        const to = MESH_NODES[b];
        return (
          <line
            key={`edge-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            className="text-white/40 dth-mesh-line"
            strokeWidth="0.15"
            style={{ animationDelay: `${(i % 6) * 0.6}s` }}
          />
        );
      })}
      {MESH_NODES.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r="0.9"
          fill="currentColor"
          className="text-accent dth-mesh-node"
          style={{ animationDelay: `${(i % 5) * 0.5}s` }}
        />
      ))}
    </svg>
  );
}

export default async function CategoryIndexPage() {
  const [categories, posts] = await Promise.all([getAllCategories(), getAllPosts()]);

  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, posts.filter((p) => p.category?.slug === c.slug).length])
  );

  const latestCoverByCategory = Object.fromEntries(
    categories.map((c) => {
      const latest = posts
        .filter((p) => p.category?.slug === c.slug)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];
      return [c.slug, c.heroImage?.url ? c.heroImage : (latest?.coverImage ?? null)];
    })
  );

  return (
    <>
      <div className="relative w-full overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 bg-primary dark:bg-[#0A1F44]">
        {/* Background image, dimmed to 50% opacity, same layering approach
            as the About page hero: image behind, brand gradient on top,
            content on top of that. */}
        <div className="absolute inset-0">
          <Image
            src="/dth1.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44]/95 via-[#0A1F44]/85 to-[#1A4FD6]/75" />

        <HeroMesh />
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1A4FD6]/40 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96rounded-full bg-[#0A1F44]/60 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest uppercase text-white/70 mb-5">
           <span className="text-accent">§</span> Browse
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighttext-white leading-[1.05] max-w-2xl">
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
            {categories.map((category, i) => {
              const Icon = CATEGORY_ICONS[category.slug] ?? Folder;
              const count = counts[category.slug] ?? 0;
              const cover = latestCoverByCategory[category.slug];

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="dth-fade-in-up opacity-0 group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    {cover?.url ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? category.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44] to-[#1A4FD6] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                    {/* Brand-blue fade instead of a plain white/card fade,
                        so the card's bottom edge reads as branded, not flat. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/90 dark:from-[#0A1F44]/95 via-[#1A4FD6]/15 to-transparent" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:border-accent/0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="relative p-8 pt-6">
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