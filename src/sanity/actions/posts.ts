"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { client, adminClient } from "../../lib/sanity";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Splits plain text into paragraph blocks, separated by blank lines.
 * v1 of the custom editor uses a plain textarea rather than a full
 * rich-text/WYSIWYG editor — every paragraph becomes a "normal" style
 * portable text block. Headings/quotes/bold can be added later by
 * swapping the textarea for something like TipTap or Sanity's own
 * block editor components.
 */
function textToBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph, i) => ({
      _type: "block",
      _key: `block-${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `span-${i}`, text: paragraph, marks: [] }],
    }));
}

/** Finds an existing tag by title (case-insensitive) or creates a new one. */
async function resolveTagIds(tagTitles: string[]): Promise<string[]> {
  const ids: string[] = [];

  for (const rawTitle of tagTitles) {
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

async function uploadCoverImageIfProvided(formData: FormData) {
  const file = formData.get("coverImage") as File | null;
  if (!file || file.size === 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return adminClient.assets.upload("image", buffer, { filename: file.name });
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify((formData.get("slug") as string) || title);
  const excerpt = formData.get("excerpt") as string;
  const contentText = formData.get("content") as string;
  const publishedAt = formData.get("publishedAt") as string;
  const readTime = Number(formData.get("readTime"));
  const categoryId = formData.get("categoryId") as string;
  const authorId = formData.get("authorId") as string;
  const tagTitles = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const coverImageAlt = formData.get("coverImageAlt") as string;

  const coverAsset = await uploadCoverImageIfProvided(formData);
  if (!coverAsset) {
    throw new Error("A cover image is required.");
  }

  const tagIds = await resolveTagIds(tagTitles);

  await adminClient.create({
    _type: "post",
    title,
    slug: { current: slug },
    excerpt,
    content: textToBlocks(contentText),
    publishedAt: new Date(publishedAt).toISOString(),
    readTime,
    category: { _type: "reference", _ref: categoryId },
    author: { _type: "reference", _ref: authorId },
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: coverAsset._id },
      alt: coverImageAlt || title,
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify((formData.get("slug") as string) || title);
  const excerpt = formData.get("excerpt") as string;
  const contentText = formData.get("content") as string;
  const publishedAt = formData.get("publishedAt") as string;
  const readTime = Number(formData.get("readTime"));
  const categoryId = formData.get("categoryId") as string;
  const authorId = formData.get("authorId") as string;
  const tagTitles = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const coverImageAlt = formData.get("coverImageAlt") as string;

  const tagIds = await resolveTagIds(tagTitles);

  const patch = adminClient.patch(postId).set({
    title,
    slug: { current: slug },
    excerpt,
    content: textToBlocks(contentText),
    publishedAt: new Date(publishedAt).toISOString(),
    readTime,
    category: { _type: "reference", _ref: categoryId },
    author: { _type: "reference", _ref: authorId },
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    ...(coverImageAlt ? { "coverImage.alt": coverImageAlt } : {}),
  });

  const coverAsset = await uploadCoverImageIfProvided(formData);
  if (coverAsset) {
    await patch
      .set({
        coverImage: {
          _type: "image",
          asset: { _type: "reference", _ref: coverAsset._id },
          alt: coverImageAlt || title,
        },
      })
      .commit();
  } else {
    await patch.commit();
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(postId: string) {
  await adminClient.delete(postId);
  revalidatePath("/admin");
}