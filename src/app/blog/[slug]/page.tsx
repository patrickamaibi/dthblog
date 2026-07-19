import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { POSTS, formatDate, getRelatedPosts } from "@/lib/data";
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
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import NewsletterPopup from "@/components/NewsletterPopup";

// Kept in sync with ArticleGrid.tsx and both /category pages —
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
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — DiscoveryTech Hub Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://blog.discoverytechhub.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      url: `https://blog.discoverytechhub.com/blog/${post.slug}`,
      images: [{ url: post.coverImage.url, width: 1920, height: 823, alt: post.coverImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage.url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const Icon = CATEGORY_ICONS[post.category.slug] ?? Folder;
  const related = getRelatedPosts(post.slug, post.category.slug, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.url,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "DiscoveryTech Hub",
      logo: { "@type": "ImageObject", url: "https://blog.discoverytechhub.com/logonav.png" },
    },
    mainEntityOfPage: `https://blog.discoverytechhub.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* ---------- Magazine-style header: image beside title/meta ---------- */}
      <div className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Ambient brand glow, consistent with category pages */}
        <div className="pointer-events-none absolute -top-24 -right-32 w-96 h-96 rounded-full bg-[#1A4FD6]/10 dark:bg-[#1A4FD6]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {post.category.title}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: kicker, title, excerpt, meta */}
            <div className="dth-fade-in-up opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <p className="font-mono text-xs tracking-widest uppercase text-accent">
                  <span>§</span> {post.category.title}
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary dark:text-white leading-[1.1] mb-6">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-accent/50 pl-4">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary dark:text-white">{post.author.name}</p>
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: cover image */}
            <div
              className="dth-fade-in-up opacity-0 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/10"
              style={{ animationDelay: "100ms" }}
            >
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Body: content + sidebar ---------- */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            {/* Main content */}
            <article
              className="prose prose-lg max-w-none dth-fade-in-up opacity-0"
              style={{ animationDelay: "150ms" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 self-start space-y-8 dth-fade-in-up opacity-0" style={{ animationDelay: "200ms" }}>
              {/* Author bio card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
                  <span>§</span> Written by
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary dark:text-white">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
                    <span>§</span> Tagged
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.slug}
                        className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related posts */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-mono text-xs tracking-widest uppercase text-accent mb-5">
                    <span>§</span> Related reading
                  </p>
                  <div className="space-y-5">
                    {related.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                          <Image
                            src={rp.coverImage.url}
                            alt={rp.coverImage.alt}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary dark:text-white leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                            {rp.title}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent">
                            Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <NewsletterPopup />
    </>
  );
}