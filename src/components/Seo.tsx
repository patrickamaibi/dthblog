import type { Metadata } from "next";

/**
 * SEO.tsx
 * ────────────────────────────────────────────────────────────────
 * Two things live here:
 *
 * 1. buildMetadata() — a helper that fills in the repetitive parts of a
 *    Next.js Metadata object (canonical URL, OG, Twitter card) from a
 *    small set of inputs, so every page.tsx / generateMetadata() only
 *    has to supply what's actually different about that page.
 *
 * 2. <JsonLd /> — a tiny component that safely renders a JSON-LD
 *    <script> tag for structured data (Article, CollectionPage,
 *    Organization, etc.), so that markup isn't hand-typed on every page.
 *
 * Neither of these makes Google crawl the site on its own — that still
 * requires the checklist at the bottom of this file — but they make
 * sure every page emits correct, consistent tags once it IS crawled.
 */

const SITE_NAME = "DiscoveryTech Hub Blog";
const SITE_URL = "https://blog.discoverytechhub.com";
const DEFAULT_OG_IMAGE = "/og.png";
const TWITTER_HANDLE = "@disctechhub"; // ← confirm this handle exists before launch

type BuildMetadataInput = {
  /** Page-specific title. Rendered through the "%s | DiscoveryTech Hub" template set in layout.tsx. */
  title: string;
  description: string;
  /** Path only, e.g. "/blog/my-post" or "/category/security". Root is "/". */
  path: string;
  /** Defaults to DEFAULT_OG_IMAGE if omitted. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** "article" for blog posts, "website" for everything else (default). */
  type?: "article" | "website";
  /** Only relevant when type is "article". */
  publishedTime?: string;
  authorName?: string;
  /** Set false to noindex a page (e.g. an internal search results page). */
  index?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  authorName,
  index = true,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME };

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index,
      follow: index,
      googleBot: { index, follow: index },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_NG",
      type,
      images: [{ url: ogImage.url, width: ogImage.width ?? 1200, height: ogImage.height ?? 630, alt: ogImage.alt ?? title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && authorName ? { authors: [authorName] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [ogImage.url],
    },
  };
}

/**
 * Renders a JSON-LD <script> tag from a plain schema.org object.
 * Usage: <JsonLd data={articleSchema} />
 * Safe to render more than once per page (each gets its own script tag).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON.stringify output, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Shared Organization schema — same shape currently inlined in layout.tsx. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DiscoveryTech Hub",
  url: "https://discoverytechhub.com",
  logo: `${SITE_URL}/logonav.png`,
  sameAs: [
    "https://web.facebook.com/disctechhub",
    "https://x.com/disctechhub",
    "https://www.linkedin.com/company/discoverytechhub",
  ],
};

/**
 * ────────────────────────────────────────────────────────────────
 * PRE-LAUNCH SEO CHECKLIST — a component alone won't make the blog
 * "visible"; these are the actual gating items:
 *
 * [ ] src/app/robots.ts (or public/robots.txt) exists and doesn't
 *     accidentally block crawlers (common on staging subdomains).
 * [ ] src/app/sitemap.ts is present (you already have this) and lists
 *     every real URL — verify it's not still pointing at placeholder data.
 * [ ] metadata.verification.google in layout.tsx is filled in with your
 *     real Search Console verification code (it's currently an empty
 *     string — Search Console can't confirm ownership without it).
 * [ ] Once live, manually submit the sitemap URL in Google Search
 *     Console (Sitemaps → Add a new sitemap) — don't just wait for
 *     Google to find it on its own; that can take weeks.
 * [ ] Confirm @disctechhub is a real, live handle before launch, or
 *     swap TWITTER_HANDLE above — a dead handle in Twitter Card tags
 *     doesn't break anything but looks unfinished.
 * [ ] /og.png must actually exist at the project root's /public folder
 *     at 1200×630 — this is what shows when the blog is shared on
 *     WhatsApp, Facebook, LinkedIn, etc.
 * ────────────────────────────────────────────────────────────────
 */