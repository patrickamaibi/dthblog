import { createPost } from "@/lib/actions/posts";
import { getAllAuthorsForAdmin, getAllCategoriesForAdmin } from "@/lib/sanity/adminQueries";

export default async function NewPostPage() {
  const [authors, categories] = await Promise.all([
    getAllAuthorsForAdmin(),
    getAllCategoriesForAdmin(),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New post</h1>

      <form action={createPost} encType="multipart/form-data" className="space-y-5">
        <Field label="Title">
          <input name="title" required className={inputClass} />
        </Field>

        <Field label="Slug" hint="Leave blank to auto-generate from the title">
          <input name="slug" className={inputClass} placeholder="my-post-title" />
        </Field>

        <Field label="Excerpt">
          <textarea name="excerpt" required rows={2} className={inputClass} maxLength={220} />
        </Field>

        <Field label="Content" hint="Separate paragraphs with a blank line">
          <textarea name="content" required rows={10} className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Published date">
            <input name="publishedAt" type="date" required className={inputClass} />
          </Field>
          <Field label="Read time (minutes)">
            <input name="readTime" type="number" min={1} required className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select name="categoryId" required className={inputClass}>
              <option value="">Select...</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
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
        </div>

        <Field label="Tags" hint="Comma-separated. New tags are created automatically.">
          <input name="tags" className={inputClass} placeholder="AI, Automation, Nigeria" />
        </Field>

        <Field label="Cover image">
          <input name="coverImage" type="file" accept="image/*" required className={inputClass} />
        </Field>

        <Field label="Cover image alt text">
          <input name="coverImageAlt" className={inputClass} />
        </Field>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Publish post
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
