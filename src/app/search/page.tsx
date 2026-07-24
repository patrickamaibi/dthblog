import { getAllPosts } from "@/sanity/lib/queries";
import SearchClient from "@/components/SearchClient";

export const revalidate = 60; // re-fetch from Sanity at most once every 60 seconds

export default async function SearchPage() {
  const posts = await getAllPosts();
  return <SearchClient posts={posts} />;
}