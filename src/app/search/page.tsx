import { getAllPosts } from "@/sanity/lib/queries";
import SearchClient from "../../components/SearchClient";

export const revalidate = 0; // always fetch fresh data from Sanity, never cache

export default async function SearchPage() {
  const posts = await getAllPosts();
  return <SearchClient posts={posts} />;
}