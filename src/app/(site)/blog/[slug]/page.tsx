import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  formatDate,
} from "@/sanity/lib/queries";
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
export const revalidate = 0; // always fetch fresh data from Sanity, never cache

const CATEGORY_ICONS: Record<string, typeof Folder> = {
  "ai-automation": Bot,
  branding: Palette,
  security: ShieldCheck,
  "digital-strategy": Compass,
  "ict-training": GraduationCap,
  web3: Blocks,
  others: Sparkles,
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return (
        <figure className="my-8 not-prose">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border">
            <Image
              src={value.asset.url}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          </div>
        </figure>
      );
    },
  },
  block: {
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent/50 pl-6 italic text-muted-foreground my-8 not-prose">
        {children}
      </blockquote>
    ),
  },
};

type PageParams = { slug: string };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = post.coverImage?.url
    ? `${post.coverImage.url}?w=1200&h=630&fit=crop&auto=format`
    : "/og.png";

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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.coverImage?.alt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const Icon = CATEGORY_ICONS[post.category?.slug] ?? Folder;
  const related = await getRelatedPosts(post.slug, post.category?.slug ?? "", 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
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

      <div className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute -top-24 -right-32 w-96 h-96 rounded-full bg-[#1A4FD6]/10 dark:bg-[#1A4FD6]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {post.category.title}
            </Link>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="dth-fade-in-up opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                {post.category && (
                  <p className="font-mono text-xs tracking-widest uppercase text-accent">
                    <span>§</span> {post.category.title}
                  </p>
                )}
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

            <div
              className="dth-fade-in-up opacity-0 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/10"
              style={{ animationDelay: "100ms" }}
            >
              {post.coverImage?.url && (
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt ?? post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </div>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article
              className="prose prose-lg max-w-none dth-fade-in-up opacity-0"
              style={{ animationDelay: "150ms" }}
            >
              {post.isStatic ? (
                <div dangerouslySetInnerHTML={{ __html: post.htmlContent ?? "" }} />
              ) : (
                <PortableText value={post.body} components={portableTextComponents} />
              )}
            </article>

            <aside className="lg:sticky lg:top-24 self-start space-y-8 dth-fade-in-up opacity-0" style={{ animationDelay: "200ms" }}>
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

              {post.tags?.length > 0 && (
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
                          {rp.coverImage?.url && (
                            <Image
                              src={rp.coverImage.url}
                              alt={rp.coverImage.alt ?? rp.title}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
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
    </>
  );
}