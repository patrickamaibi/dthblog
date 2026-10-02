import { getAllPosts } from "@/sanity/lib/queries";
import SearchClient from "@/components/SearchClient";
import { buildMetadata } from "@/components/Seo";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

export const metadata = buildMetadata({
  title: "Search",
  description: "Search articles on the DiscoveryTech Hub Blog.",
  path: "/search",
  index: false,
  follow: true,
});

export default async function SearchPage() {
  const posts = await getAllPosts();
  return <SearchClient posts={posts} />;
}
