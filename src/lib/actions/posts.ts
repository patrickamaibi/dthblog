"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/sanity/lib/adminClient";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getField(formData: FormData, name: string, fallback = ""): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : fallback;
}

function getAllFields(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

function parseBody(raw: string): Record<string, unknown>[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Post content is not valid — please re-check the editor content.");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Post content must be a list of blocks.");
  }
  return parsed as Record<string, unknown>[];
}

function parsePublishedAtLoose(value: string): string {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function parsePublishedAtStrict(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("A valid published date is required.");
  }
  return date.toISOString();
}

async function uploadImageIfProvided(file: File | null) {
  if (!file || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return adminClient.assets.upload("image", buffer, { filename: file.name });
}

async function uploadGalleryImages(formData: FormData, name: string) {
  const files = formData.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = [];
  for (const file of files) {
    const asset = await uploadImageIfProvided(file);
    if (asset) {
      uploaded.push({
        _type: "image",
        _key: asset._id,
        asset: { _type: "reference", _ref: asset._id },
      });
    }
  }
  return uploaded;
}

async function resolveNewTagIds(titles: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const rawTitle of titles) {
    const title = rawTitle.trim();
    if (!title) continue;
    const existing = await adminClient.fetch(
      `*[_type == "tag" && lower(title) == lower($title)][0]{ _id }`,
      { title }
    );
    if (existing?._id) {
      ids.push(existing._id);
      continue;
    }
    const created = await adminClient.create({
      _type: "tag",
      title,
      slug: { current: slugify(title) },
    });
    ids.push(created._id);
  }
  return ids;
}

async function resolveAllTagIds(formData: FormData): Promise<string[]> {
  const checkedTagIds = getAllFields(formData, "tagIds");
  const newTagTitles = getField(formData, "newTags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const createdTagIds = await resolveNewTagIds(newTagTitles);
  return Array.from(new Set([...checkedTagIds, ...createdTagIds]));
}

function revalidatePublicPages(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/category");
  revalidatePath("/search");
  revalidatePath("/category/[slug]", "page");
  if (slug) revalidatePath(`/blog/${slug}`);
}

async function upsertPost(
  postId: string | null,
  formData: FormData,
  status: "draft" | "published",
  strict: boolean
): Promise<{ id: string }> {
  const title = getField(formData, "title") || (strict ? "" : "Untitled draft");
  if (strict && !title) {
    throw new Error("Title is required.");
  }

  const slug = slugify(getField(formData, "slug") || title || `draft-${Date.now()}`);
  const excerpt = getField(formData, "excerpt");
  const readTimeRaw = getField(formData, "readTime");
  const readTime = readTimeRaw ? Number(readTimeRaw) : 1;
  const authorId = getField(formData, "authorId");
  const categoryIds = getAllFields(formData, "categoryIds");

  if (strict) {
    if (!authorId) throw new Error("Author is required.");
    if (Number.isNaN(readTime)) throw new Error("Read time must be a number.");
  }

  const publishedAt = strict
    ? parsePublishedAtStrict(getField(formData, "publishedAt"))
    : parsePublishedAtLoose(getField(formData, "publishedAt"));

  const body = parseBody(getField(formData, "body"));
  const tagIds = await resolveAllTagIds(formData);
  const mainImageAlt = getField(formData, "mainImageAlt");

  const mainImageFile = formData.get("mainImage") as File | null;
  const mainAsset = await uploadImageIfProvided(mainImageFile);

  if (strict && !mainAsset && !postId) {
    throw new Error("A cover image is required.");
  }

  const baseDoc: Record<string, unknown> = {
    title,
    slug: { current: slug },
    excerpt,
    body,
    publishedAt,
    readTime: Number.isNaN(readTime) ? 1 : readTime,
    status,
    ...(authorId ? { author: { _type: "reference", _ref: authorId } } : {}),
    categories: categoryIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    ...(mainAsset
      ? {
          mainImage: {
            _type: "image",
            asset: { _type: "reference", _ref: mainAsset._id },
            alt: mainImageAlt || title,
          },
        }
      : mainImageAlt
      ? { "mainImage.alt": mainImageAlt }
      : {}),
  };

  const newGalleryImages = await uploadGalleryImages(formData, "gallery");
  const removedGalleryKeys = getAllFields(formData, "removeGalleryKeys");

  let id: string;
  if (postId) {
    const patch = adminClient.patch(postId).set(baseDoc);
    if (newGalleryImages.length > 0) {
      patch.setIfMissing({ gallery: [] }).append("gallery", newGalleryImages);
    }
    for (const key of removedGalleryKeys) {
      patch.unset([`gallery[_key=="${key}"]`]);
    }
    await patch.commit();
    id = postId;
  } else {
    const created = await adminClient.create({
      _type: "post",
      ...baseDoc,
      gallery: newGalleryImages,
    });
    id = created._id;
  }

  revalidatePublicPages(status === "published" ? slug : undefined);
  return { id };
}

export async function saveDraft(postId: string | null, formData: FormData) {
  return upsertPost(postId, formData, "draft", false);
}

export async function publishPost(postId: string | null, formData: FormData) {
  return upsertPost(postId, formData, "published", true);
}

export async function deletePost(postId: string) {
  await adminClient.delete(postId);
  revalidatePublicPages();
}