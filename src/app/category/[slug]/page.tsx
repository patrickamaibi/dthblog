import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { POSTS, CATEGORIES, formatDate } from "@/lib/data";
import {
  ArrowLeft,
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
import NewsletterPopup from "@/components/NewsletterPopup";

// Kept in sync with ArticleGrid.tsx and /category/page.tsx —
// slugs match the real Category.slug values in lib/data.ts.
const CATEGORY_ICONS: Record<string, typeof Folder> = {
  "ai-automation": Bot,
  branding: Palette,
  security: ShieldCheck,
  "digital-strategy": Compass,
  "ict-training": GraduationCap,
  web3: Blocks,
  others: Sparkles,
};

type PageParams = { slug: string };

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  // Category has no coverImage of its own — borrow the most recent post's cover
  // in this category so link previews still get an image.
  const heroPost = POSTS.filter((p) => p.category.slug === category.slug).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];

  return {
    title: `${category.title} — DiscoveryTech Hub Blog`,
    description: category.description,
    alternates: {
      canonical: `https://blog.discoverytechhub.com/category/${category.slug}`,
    },
    openGraph: {
      title: category.title,
      description: category.description,
      type: "website",
      url: `https://blog.discoverytechhub.com/category/${category.slug}`,
      images: heroPost ? [{ url: heroPost.coverImage.url, width: 1920, height: 823, alt: heroPost.coverImage.alt }] : [],
    },
  };
}

// Same fixed mesh layout used on the /category index hero, so the two pages
// read as one visual family instead of two different treatments.
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
      className="pointer-events-none absolute inset-0 w-full h-full opacity-30 dark:opacity-25"
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const posts = POSTS.filter((p) => p.category.slug === category.slug).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const Icon = CATEGORY_ICONS[category.slug] ?? Folder;

  // Category has no dedicated banner field — use the most recent post's cover
  // so every category still gets a hero image.
  const heroImage = posts[0]?.coverImage;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `https://blog.discoverytechhub.com/category/${category.slug}`,
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `https://blog.discoverytechhub.com/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Editorial hero — cinematic crop + a subtle animated network mesh
          layered over the post's cover image for a more premium, less
          "stock photo" feel. Falls back to a brand gradient + mesh only
          when the category has no posts yet. */}
      <div className="relative w-full aspect-[21/9] mt-20 overflow-hidden">
        {heroImage ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover dth-hero-zoom"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44] to-[#1A4FD6]" />
        )}

        <HeroMesh />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 dark:from-black/90 via-primary/25 dark:via-black/40 to-transparent" />

        {/* Ambient brand-color wash, matching the Hero component's backdrop treatment */}
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#1A4FD6]/30 blur-[100px]" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 pb-12 md:pb-16">
            <Link
              href="/category"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> All topics
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-white/70">
                <span className="text-accent">§</span> Topic
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5 max-w-3xl">
              {category.title}
            </h1>

            {category.description && (
              <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl border-l-2 border-accent/60 pl-4">
                {category.description}
              </p>
            )}

            <p className="mt-8 font-mono text-xs text-white/60 tracking-wide">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>
      </div>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-3">
                <span className="text-accent">§</span> Nothing here yet
              </p>
              <p className="text-muted-foreground max-w-md mx-auto">
                We haven&apos;t published in {category.title} yet — check back soon, or explore another topic.
              </p>
              <Link
                href="/category"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary dark:bg-white text-white dark:text-primary px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Browse all topics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="pt-16 md:pt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article
                  key={post.slug}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="dth-fade-in-up opacity-0 group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative w-full aspect-[3/2] overflow-hidden">
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground mb-3">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                        <span>·</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      <h3 className="text-lg font-bold text-primary dark:text-white leading-snug group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-accent">
                        Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterPopup />
    </>
  );
}