import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import Newsletter from "@/components/Newsletter";
export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

export default function Home() {
  return (
    <>
      <Hero />
      <ArticleGrid />
      <Newsletter />
    </>
  );
}