import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import Newsletter from "@/components/Newsletter";
import { buildMetadata } from "@/components/Seo";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

export const metadata = buildMetadata({
  title: "DiscoveryTech Hub Blog: ICT & Digital Transformation",
  titleAbsolute: true,
  description:
    "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa, from AI automation to branding, security, and digital strategy.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ArticleGrid />
      <Newsletter />
    </>
  );
}
