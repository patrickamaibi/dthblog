import Image from "next/image";
import { notFound } from "next/navigation";
import { updatePost } from "@/lib/actions/posts";
import {
  getAllAuthorsForAdmin,
  getAllCategoriesForAdmin,
  getPostByIdForAdmin,
} from "@/lib/sanity/adminQueries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, authors, categories] = await Promise.all([
    getPostByIdForAdmin(id),
    getAllAuthorsForAdmin(),
    getAllCategoriesForAdmin(),
  ]);

  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, post._id);
  const publishedDateValue = new Date(post.publishedAt).toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit post</h1>

      <form action={updatePostWithId} encType="multipart/form-data" className="space-y-5">
        <Field label="Title">
          <input name="title" required defaultValue={post.title} className={inputClass} />
        </Field>

        <Field label="Slug">
          <input name="slug" defaultValue={post.slug} className={inputClass} />
        </Field>

        <Field label="Excerpt">
          <textarea
            name="excerpt"
            required
            rows={2}
            maxLength={220}
            defaultValue={post.excerpt}
            className={inputClass}
          />
        </Field>

        <Field label="Content" hint="Separate paragraphs with a blank line">
          <textarea
            name="content"
            required
            rows={10}
            defaultValue={post.contentText}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Published date">
            <input
              name="publishedAt"
              type="date"
              required
              defaultValue={publishedDateValue}
              className={inputClass}
            />
          </Field>
          <Field label="Read time (minutes)">
            <input
              name="readTime"
              type="number"
              min={1}
              required
              defaultValue={post.readTime}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select name="categoryId" required defaultValue={post.categoryId} className={inputClass}>
              <option value="">Select...</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Author">
            <select name="authorId" required defaultValue={post.authorId} className={inputClass}>
              <option value="">Select...</option>
              {authors.map((a: any) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Tags" hint="Comma-separated. New tags are created automatically.">
          <input
            name="tags"
            defaultValue={(post.tagTitles ?? []).join(", ")}
            className={inputClass}
          />
        </Field>

        {post.coverImageUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
            <Image src={post.coverImageUrl} alt="" fill className="object-cover" />
          </div>
        )}

        <Field label="Replace cover image" hint="Leave empty to keep the current image">
          <input name="coverImage" type="file" accept="image/*" className={inputClass} />
        </Field>

        <Field label="Cover image alt text">
          <input name="coverImageAlt" defaultValue={post.coverImageAlt} className={inputClass} />
        </Field>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
