import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/sanity/lib/queries";
import {
  JsonLd,
  buildMetadata,
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
} from "@/components/Seo";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

const DESCRIPTION =
  "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa, from AI automation to branding, security, and digital strategy.";

export const metadata = buildMetadata({
  title: "DiscoveryTech Hub Blog: ICT & Digital Transformation",
  titleAbsolute: true,
  description: DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const posts = (await getAllPosts()).slice(0, 10);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/#blog`,
    url: SITE_URL,
    name: "DiscoveryTech Hub Blog",
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${p.slug}#article`,
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt || p.publishedAt,
      author: p.author?.name
        ? { "@type": "Person", name: p.author.name }
        : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <Hero />
      <ArticleGrid />
      <Newsletter />
    </>
  );
}
