import type { Metadata } from "next";

/**
 * Seo.tsx
 * ------------------------------
 * 1. buildMetadata() fills in the repetitive parts of a Next.js Metadata
 *    object (canonical URL, OG, Twitter card) so each page only supplies
 *    what is different about it.
 * 2. <JsonLd /> renders a JSON-LD <script> tag safely.
 * 3. breadcrumbJsonLd() builds a BreadcrumbList for any page.
 *
 * Titles passed to buildMetadata() go through the "%s | DiscoveryTech Hub"
 * template in the root layout, so do not add the brand name yourself.
 */

const SITE_NAME = "DiscoveryTech Hub Blog";
const SITE_URL = "https://blog.discoverytechhub.com";
const MAIN_SITE_URL = "https://discoverytechhub.com";
const DEFAULT_OG_IMAGE = "/og.png";
const TWITTER_HANDLE = "@disctechhub"; // confirm this handle exists

type BuildMetadataInput = {
  /** Page-specific title, without the brand name. */
  title: string;
  description: string;
  /** Path only, e.g. "/blog/my-post" or "/category/security". Root is "/". */
  path: string;
  /** Defaults to DEFAULT_OG_IMAGE if omitted. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** "article" for blog posts, "website" for everything else (default). */
  type?: "article" | "website";
  /** Only used when type is "article". */
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  /** Set false to noindex a page (e.g. internal search results). */
  index?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authorName,
  index = true,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const ogImage = image ?? {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  };

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
      images: [
        {
          url: ogImage.url,
          width: ogImage.width ?? 1200,
          height: ogImage.height ?? 630,
          alt: ogImage.alt ?? title,
        },
      ],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
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
 * "<" is escaped so content can never close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON.stringify output with "<" escaped
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Same organization entity the root layout emits, for reuse elsewhere. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${MAIN_SITE_URL}/#organization`,
  name: "DiscoveryTech Hub",
  url: MAIN_SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logonav.png`,
  },
  sameAs: [
    "https://www.facebook.com/disctechhub",
    "https://x.com/disctechhub",
    "https://www.linkedin.com/company/discoverytechhub",
  ],
};

/** BreadcrumbList. Pass paths, not full URLs: [{ name: "Home", path: "/" }, ...] */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * Pre-launch checklist
 * [ ] Submit https://blog.discoverytechhub.com/sitemap.xml in Google Search
 *     Console (Sitemaps -> Add a new sitemap).
 * [ ] Make sure the site is verified in Search Console. If you verify with a
 *     meta tag, add it under `verification.google` in the root layout.
 * [ ] Confirm @disctechhub is a real handle, or change TWITTER_HANDLE above.
 * [ ] /public/og.png should be 1200 x 630.
 */
