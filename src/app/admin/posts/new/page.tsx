import {
  getAllAuthorsForAdmin,
  getAllCategoriesForAdmin,
  getAllTagsForAdmin,
} from "@/sanity/lib/adminQueries";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const [authors, categories, tags] = await Promise.all([
    getAllAuthorsForAdmin(),
    getAllCategoriesForAdmin(),
    getAllTagsForAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New post</h1>
      <PostForm postId={null} authors={authors} categories={categories} tags={tags} />
    </div>
  );
}