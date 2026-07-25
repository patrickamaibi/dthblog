"use server";

import { redirect } from "next/navigation";
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

function parsePublishedAt(value: string): string {
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

// Centralized so the public route pattern only needs to change in one place
// if your blog's URL structure ever changes.
function revalidatePublicPost(slug: string) {
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog"); // listing/index page
}

export async function createPost(formData: FormData) {
  const title = getField(formData, "title");
  if (!title) {
    throw new Error("Title is required.");
  }

  const slug = slugify(getField(formData, "slug") || title);
  const excerpt = getField(formData, "excerpt");
  const readTime = Number(getField(formData, "readTime"));
  const authorId = getField(formData, "authorId");
  const categoryIds = getAllFields(formData, "categoryIds");

  if (!authorId) {
    throw new Error("Author is required.");
  }
  if (Number.isNaN(readTime)) {
    throw new Error("Read time must be a number.");
  }

  const publishedAt = parsePublishedAt(getField(formData, "publishedAt"));
  const body = parseBody(getField(formData, "body"));
  const tagIds = await resolveAllTagIds(formData);

  const mainImageFile = formData.get("mainImage") as File | null;
  const mainAsset = await uploadImageIfProvided(mainImageFile);
  if (!mainAsset) {
    throw new Error("A cover image is required.");
  }
  const mainImageAlt = getField(formData, "mainImageAlt");

  const galleryImages = await uploadGalleryImages(formData, "gallery");

  await adminClient.create({
    _type: "post",
    title,
    slug: { current: slug },
    excerpt,
    body,
    publishedAt,
    readTime,
    author: { _type: "reference", _ref: authorId },
    categories: categoryIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    gallery: galleryImages,
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: mainAsset._id },
      alt: mainImageAlt || title,
    },
  });

  revalidatePath("/admin");
  revalidatePublicPost(slug);
  redirect("/admin?created=1");
}

export async function updatePost(postId: string, formData: FormData) {
  const title = getField(formData, "title");
  if (!title) {
    throw new Error("Title is required.");
  }

  const slug = slugify(getField(formData, "slug") || title);
  const excerpt = getField(formData, "excerpt");
  const readTime = Number(getField(formData, "readTime"));
  const authorId = getField(formData, "authorId");
  const categoryIds = getAllFields(formData, "categoryIds");

  if (!authorId) {
    throw new Error("Author is required.");
  }
  if (Number.isNaN(readTime)) {
    throw new Error("Read time must be a number.");
  }

  const publishedAt = parsePublishedAt(getField(formData, "publishedAt"));
  const body = parseBody(getField(formData, "body"));
  const tagIds = await resolveAllTagIds(formData);
  const mainImageAlt = getField(formData, "mainImageAlt");

  const patch = adminClient.patch(postId).set({
    title,
    slug: { current: slug },
    excerpt,
    body,
    publishedAt,
    readTime,
    author: { _type: "reference", _ref: authorId },
    categories: categoryIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    ...(mainImageAlt ? { "mainImage.alt": mainImageAlt } : {}),
  });

  const mainImageFile = formData.get("mainImage") as File | null;
  const mainAsset = await uploadImageIfProvided(mainImageFile);
  if (mainAsset) {
    patch.set({
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: mainAsset._id },
        alt: mainImageAlt || title,
      },
    });
  }

  const newGalleryImages = await uploadGalleryImages(formData, "gallery");
  if (newGalleryImages.length > 0) {
    patch.setIfMissing({ gallery: [] }).append("gallery", newGalleryImages);
  }

  const removedGalleryKeys = getAllFields(formData, "removeGalleryKeys");
  for (const key of removedGalleryKeys) {
    patch.unset([`gallery[_key=="${key}"]`]);
  }

  await patch.commit();

  revalidatePath("/admin");
  revalidatePublicPost(slug);
  redirect("/admin?updated=1");
}

export async function deletePost(postId: string) {
  // Fetch the slug before deleting so we can still revalidate the now-gone
  // post's page (important if your route isn't set up to 404 gracefully
  // on stale cached content).
  const post = await adminClient.fetch(`*[_id == $id][0]{ "slug": slug.current }`, {
    id: postId,
  });

  await adminClient.delete(postId);

  revalidatePath("/admin");
  if (post?.slug) {
    revalidatePublicPost(post.slug);
  } else {
    revalidatePath("/blog");
  }
}