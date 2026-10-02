import type { Metadata } from "next";

/**
 * Seo.tsx
 * ------------------------------
 * 1. buildMetadata() fills in the repetitive parts of a Next.js Metadata
 *    object (canonical URL, OG, Twitter card, RSS link) so each page only
 *    supplies what is different about it.
 * 2. <JsonLd /> renders a JSON-LD <script> tag safely.
 * 3. breadcrumbJsonLd(), ogImage() and absoluteUrl() are shared helpers.
 *
 * Titles passed to buildMetadata() go through the "%s | DiscoveryTech Hub"
 * template in the root layout, so do not add the brand name yourself.
 * Use titleAbsolute when the title is long or already carries the brand.
 */

export const SITE_NAME = "DiscoveryTech Hub Blog";
export const SITE_URL = "https://blog.discoverytechhub.com";
export const MAIN_SITE_URL = "https://discoverytechhub.com";
export const ORG_ID = `${MAIN_SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const DEFAULT_OG_IMAGE = "/og.png";
const TWITTER_HANDLE = "@disctechhub"; // confirm this handle exists

type ShareImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildMetadataInput = {
  /** Page-specific title, without the brand name. */
  title: string;
  /** true = do not append " | DiscoveryTech Hub" to the title. */
  titleAbsolute?: boolean;
  description: string;
  /** Path only, e.g. "/blog/my-post" or "/category/security". Root is "/". */
  path: string;
  /** Defaults to the site's /og.png if omitted. */
  image?: ShareImage;
  /** "article" for blog posts, "website" for everything else (default). */
  type?: "article" | "website";
  /** Only used when type is "article". */
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  /** Set false to noindex a page. */
  index?: boolean;
  /** Defaults to the same value as index. Use index:false + follow:true for archives. */
  follow?: boolean;
};

/** Turns a path or URL into a full https URL on this site. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Share image for Open Graph and Twitter. Sanity CDN images are cropped to
 * 1200x630 by the CDN; local /public images are used as they are.
 */
export function ogImage(url: string | null | undefined, alt: string): ShareImage {
  if (!url) return { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt };
  if (url.includes("cdn.sanity.io")) {
    const sep = url.includes("?") ? "&" : "?";
    return {
      url: `${url}${sep}w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
      alt,
    };
  }
  return { url, alt };
}

export function buildMetadata({
  title,
  titleAbsolute = false,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authorName,
  index = true,
  follow,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const shareImage: ShareImage = image ?? {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  };
  const shouldFollow = follow ?? index;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    // Page-level "alternates" replaces the layout's, so the RSS link is repeated here.
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
    robots: {
      index,
      follow: shouldFollow,
      googleBot: { index, follow: shouldFollow },
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
          url: shareImage.url,
          ...(shareImage.width ? { width: shareImage.width } : {}),
          ...(shareImage.height ? { height: shareImage.height } : {}),
          alt: shareImage.alt ?? title,
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
      images: [shareImage.url],
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
  "@id": ORG_ID,
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
