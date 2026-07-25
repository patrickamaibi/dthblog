import { notFound } from "next/navigation";
import {
  getAllAuthorsForAdmin,
  getAllCategoriesForAdmin,
  getAllTagsForAdmin,
  getPostByIdForAdmin,
} from "@/sanity/lib/adminQueries";
import { EditPostForm } from "./EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, authors, categories, tags] = await Promise.all([
    getPostByIdForAdmin(id),
    getAllAuthorsForAdmin(),
    getAllCategoriesForAdmin(),
    getAllTagsForAdmin(),
  ]);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit post</h1>
      <EditPostForm post={post} authors={authors} categories={categories} tags={tags} />
    </div>
  );
}