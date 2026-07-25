import { createPost } from "@/sanity/actions/posts";
import {
  getAllAuthorsForAdmin,
  getAllCategoriesForAdmin,
  getAllTagsForAdmin,
} from "@/sanity/lib/adminQueries";
import { RichTextEditor } from "@/components/RichTextEditor";
import { GalleryUploader } from "@/components/GalleryUploader";

export default async function NewPostPage() {
  const [authors, categories, tags] = await Promise.all([
    getAllAuthorsForAdmin(),
    getAllCategoriesForAdmin(),
    getAllTagsForAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New post</h1>

      <form action={createPost} encType="multipart/form-data" className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <Field label="Title">
            <input name="title" required className={inputClass} />
          </Field>

          <Field label="Slug" hint="Leave blank to auto-generate from the title">
            <input name="slug" className={inputClass} placeholder="my-post-title" />
          </Field>

          <Field label="Excerpt">
            <textarea name="excerpt" required rows={2} maxLength={220} className={inputClass} />
          </Field>

          <Field label="Content">
            <RichTextEditor name="body" />
          </Field>
        </section>

        <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <Field label="Published date">
            <input name="publishedAt" type="date" required className={inputClass} />
          </Field>
          <Field label="Read time (minutes)">
            <input name="readTime" type="number" min={1} required className={inputClass} />
          </Field>

          <Field label="Author">
            <select name="authorId" required className={inputClass}>
              <option value="">Select...</option>
              {authors.map((a: any) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Categories">
            <CheckboxGroup name="categoryIds" items={categories} labelKey="title" />
          </Field>

          <div className="col-span-2">
            <Field label="Tags">
              <CheckboxGroup name="tagIds" items={tags} labelKey="title" />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="New tags" hint="Comma-separated, created automatically if they don't exist yet">
              <input name="newTags" className={inputClass} placeholder="AI, Automation, Nigeria" />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <Field label="Cover image">
            <input name="mainImage" type="file" accept="image/*" required className={inputClass} />
          </Field>

          <Field label="Cover image alt text">
            <input name="mainImageAlt" className={inputClass} />
          </Field>

          <Field label="Gallery" hint="Extra images for this post, separate from the cover">
            <GalleryUploader name="gallery" />
          </Field>
        </section>

        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Publish post
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900";

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
}: {
  name: string;
  items: any[];
  labelKey: string;
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
          <input type="checkbox" name={name} value={item._id} className="accent-blue-600" />
          {item[labelKey]}
        </label>
      ))}
    </div>
  );
}