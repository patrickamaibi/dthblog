"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveDraft, publishPost } from "@/lib/actions/posts";
import { RichTextEditor } from "@/components/RichTextEditor";
import { GalleryUploader, GalleryUploaderHandle, ExistingGalleryImage } from "@/components/GalleryUploader";

const AUTOSAVE_INTERVAL_MS = 120000; // 2 minutes

type PostFormProps = {
  postId: string | null;
  initial?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: any;
    publishedAt?: string;
    readTime?: number;
    authorId?: string;
    categoryIds?: string[];
    tagIds?: string[];
    coverImageUrl?: string;
    coverImageAlt?: string;
    gallery?: ExistingGalleryImage[];
  };
  authors: any[];
  categories: any[];
  tags: any[];
};

export function PostForm({ postId: initialPostId, initial, authors, categories, tags }: PostFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const galleryRef = useRef<GalleryUploaderHandle>(null);
  const [postId, setPostId] = useState<string | null>(initialPostId);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPublishing, startPublishTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const publishedDateValue = initial?.publishedAt
    ? new Date(initial.publishedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const postIdRef = useRef(postId);
  postIdRef.current = postId;

  // Stops the autosave loop from firing saveDraft() once a publish is in
  // flight or has succeeded — otherwise the next tick silently flips
  // status back to "draft" right after a successful publish.
  const suspendAutosaveRef = useRef(false);

  // Clears the mainImage and gallery <input type="file"> elements after a
  // successful save. Without this, both inputs keep holding the same
  // FileList indefinitely, so every subsequent autosave tick re-uploads the
  // same files: wasted uploads for the cover image, and duplicate appended
  // entries for the gallery (since gallery writes are additive).
  function clearUploadedFileInputs() {
    if (formRef.current) {
      const mainImageInput = formRef.current.elements.namedItem("mainImage") as HTMLInputElement | null;
      if (mainImageInput) mainImageInput.value = "";
    }
    galleryRef.current?.reset();
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (suspendAutosaveRef.current) return;
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      const title = formData.get("title");
      if (!title || typeof title !== "string" || !title.trim()) return;

      setSaveState("saving");
      startSaveTransition(async () => {
        try {
          const result = await saveDraft(postIdRef.current, formData);
          if (!postIdRef.current && result?.id) {
            setPostId(result.id);
            router.replace(`/admin/posts/${result.id}/edit`);
          }
          clearUploadedFileInputs();
          setSaveState("saved");
        } catch (err) {
          console.error(err);
          setSaveState("error");
        }
      });
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [router]);

  function readFormData() {
    if (!formRef.current) return null;
    return new FormData(formRef.current);
  }

  async function handleSaveDraft() {
    const formData = readFormData();
    if (!formData) return;
    setErrorMsg(null);
    setSaveState("saving");
    startSaveTransition(async () => {
      try {
        const result = await saveDraft(postIdRef.current, formData);
        if (!postIdRef.current && result?.id) {
          setPostId(result.id);
          router.replace(`/admin/posts/${result.id}/edit`);
        }
        clearUploadedFileInputs();
        setSaveState("saved");
      } catch (err) {
        console.error(err);
        setSaveState("error");
        setErrorMsg(err instanceof Error ? err.message : "Failed to save draft.");
      }
    });
  }

  async function handlePublish() {
    const formData = readFormData();
    if (!formData) return;
    setErrorMsg(null);
    suspendAutosaveRef.current = true; // stop autosave from clobbering the publish
    startPublishTransition(async () => {
      try {
        const result = await publishPost(postIdRef.current, formData);
        void result;
        router.push(postIdRef.current ? "/admin?updated=1" : "/admin?created=1");
      } catch (err) {
        suspendAutosaveRef.current = false; // publish failed, resume normal autosave
        setErrorMsg(err instanceof Error ? err.message : "Failed to publish post.");
      }
    });
  }

  return (
    <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {errorMsg && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {saveState === "saving" && "Saving draft…"}
          {saveState === "saved" && "Draft saved"}
          {saveState === "error" && (
            <span className="text-red-500">Autosave failed — your last saved version is still there</span>
          )}
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <Field label="Title">
          <input name="title" required defaultValue={initial?.title} className={inputClass} />
        </Field>

        <Field label="Slug" hint="Leave blank to auto-generate from the title">
          <input name="slug" defaultValue={initial?.slug} className={inputClass} placeholder="my-post-title" />
        </Field>

        <Field label="Excerpt">
          <textarea
            name="excerpt"
            rows={2}
            maxLength={220}
            defaultValue={initial?.excerpt}
            className={inputClass}
          />
        </Field>

        <Field label="Content">
          <RichTextEditor name="body" initialContent={initial?.body} />
        </Field>
      </section>

      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <Field label="Published date">
          <input
            name="publishedAt"
            type="date"
            defaultValue={publishedDateValue}
            className={inputClass}
          />
        </Field>
        <Field label="Read time (minutes)">
          <input
            name="readTime"
            type="number"
            min={1}
            defaultValue={initial?.readTime}
            className={inputClass}
          />
        </Field>

        <Field label="Author">
          <select name="authorId" defaultValue={initial?.authorId} className={inputClass}>
            <option value="">Select...</option>
            {authors.map((a: any) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Categories">
          <CheckboxGroup name="categoryIds" items={categories} labelKey="title" checkedIds={initial?.categoryIds ?? []} />
        </Field>

        <div className="col-span-2">
          <Field label="Tags">
            <CheckboxGroup name="tagIds" items={tags} labelKey="title" checkedIds={initial?.tagIds ?? []} />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="New tags" hint="Comma-separated, created automatically if they don't exist yet">
            <input name="newTags" className={inputClass} placeholder="AI, Automation, Nigeria" />
          </Field>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        {initial?.coverImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
            <Image src={initial.coverImageUrl} alt="" fill className="object-cover" />
          </div>
        )}

        <Field
          label="Cover image"
          hint={
            initial?.coverImageUrl
              ? "Leave empty to keep the current image"
              : "Required for new posts"
          }
        >
          <input name="mainImage" type="file" accept="image/*" className={inputClass} />
        </Field>

        <Field label="Cover image alt text">
          <input name="mainImageAlt" defaultValue={initial?.coverImageAlt} className={inputClass} />
        </Field>

        <Field label="Gallery" hint="Extra images for this post, separate from the cover">
          <GalleryUploader ref={galleryRef} name="gallery" existingImages={initial?.gallery ?? []} />
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving || isPublishing}
          className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save draft"}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPublishing ? "Publishing..." : "Publish post"}
        </button>
      </div>
    </form>
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