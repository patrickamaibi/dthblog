import Image from "next/image";
import { notFound } from "next/navigation";
import { updatePost } from "@/sanity/actions/posts";
import {
  getAllAuthorsForAdmin,
  getAllCategoriesForAdmin,
  getAllTagsForAdmin,
  getPostByIdForAdmin,
} from "@/sanity/lib/adminQueries";
import { RichTextEditor } from "@/components/RichTextEditor";
import { GalleryUploader } from "@/components/GalleryUploader";

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

  const updatePostWithId = updatePost.bind(null, post._id);
  const publishedDateValue = new Date(post.publishedAt).toISOString().slice(0, 10);
  const categoryIds: string[] = post.categoryIds ?? [];
  const tagIds: string[] = post.tagIds ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit post</h1>

      <form action={updatePostWithId} encType="multipart/form-data" className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
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

          <Field label="Content">
            <RichTextEditor {...({ name: "body", initialContent: post.body } as any)} />
          </Field>
        </section>

        <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
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

          <Field label="Categories">
            <CheckboxGroup
              name="categoryIds"
              items={categories}
              labelKey="title"
              checkedIds={categoryIds}
            />
          </Field>

          <div className="col-span-2">
            <Field label="Tags">
              <CheckboxGroup name="tagIds" items={tags} labelKey="title" checkedIds={tagIds} />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="New tags" hint="Comma-separated, created automatically if they don't exist yet">
              <input name="newTags" className={inputClass} placeholder="AI, Automation, Nigeria" />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          {post.coverImageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
              <Image src={post.coverImageUrl} alt="" fill className="object-cover" />
            </div>
          )}

          <Field label="Replace cover image" hint="Leave empty to keep the current image">
            <input name="mainImage" type="file" accept="image/*" className={inputClass} />
          </Field>

          <Field label="Cover image alt text">
            <input name="mainImageAlt" defaultValue={post.coverImageAlt} className={inputClass} />
          </Field>

          <Field label="Gallery" hint="Upload to add more images. Existing gallery images aren't shown here yet.">
            <GalleryUploader name="gallery" />
          </Field>
        </section>

        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function CheckboxGroup({
  name,
  items,
  labelKey,
  checkedIds = [],
}: {
  name: string;
  items: any[];
  labelKey: string;
  checkedIds?: string[];
}) {
  if (!items.length) {
    return <p className="text-xs text-slate-400">None created yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <label
          key={item._id}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
        >
          <input
            type="checkbox"
            name={name}
            value={item._id}
            defaultChecked={checkedIds.includes(item._id)}
            className="accent-blue-600"
          />
          {item[labelKey]}
        </label>
      ))}
    </div>
  );
}