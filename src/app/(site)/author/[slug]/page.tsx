import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllAuthorSlugs,
  getAuthorBySlug,
  getPostsByAuthor,
  formatDate,
} from "@/sanity/lib/queries";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import type { Metadata } from "next";
import {
  JsonLd,
  buildMetadata,
  breadcrumbJsonLd,
  ogImage,
  absoluteUrl,
  SITE_URL,
  WEBSITE_ID,
} from "@/components/Seo";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

type PageParams = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};

  const posts = await getPostsByAuthor(slug);

  const description =
    author.bio?.slice(0, 155) ||
    `Articles by ${author.name}${author.role ? `, ${author.role}` : ""} on the DiscoveryTech Hub blog.`;

  return buildMetadata({
    title: `Articles by ${author.name}`,
    description,
    path: `/author/${slug}`,
    image: ogImage(author.avatar, author.name),
    // An author with no articles is a thin page, so keep it out of search results
    index: posts.length > 0,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getPostsByAuthor(slug);

  const profileUrl = `${SITE_URL}/author/${slug}`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "Person",
      "@id": `${profileUrl}#person`,
      name: author.name,
      jobTitle: author.role || undefined,
      description: author.bio || undefined,
      image: author.avatar ? absoluteUrl(author.avatar) : undefined,
      url: profileUrl,
    },
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: author.name, path: `/author/${slug}` },
        ])}
      />

      {/* The site layout already provides the <main> element */}
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to articles
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-border bg-card flex items-center justify-center shrink-0">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>

            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Author
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary dark:text-white mb-1">
                {author.name}
              </h1>
              {author.role && (
                <p className="text-sm font-medium text-accent">{author.role}</p>
              )}
            </div>
          </div>

          {author.bio && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl mb-16 border-l-2 border-accent/60 pl-4">
              {author.bio}
            </p>
          )}

          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-8">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>

          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground max-w-md mx-auto">
                {author.name} hasn&apos;t published any articles yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article
                  key={post.slug}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="dth-fade-in-up opacity-0 group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative w-full aspect-[3/2] overflow-hidden">
                      {post.coverImage?.url && (
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.alt}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
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
      </div>
    </>
  );
}
