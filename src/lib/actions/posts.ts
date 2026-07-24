"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/sanity/adminClient";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Parses **bold** segments within a single line of text into Portable Text spans.
function parseInline(text: string, blockIndex: number) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);

  if (parts.length === 0) {
    return [{ _type: "span", _key: `span-${blockIndex}-0`, text: "", marks: [] }];
  }

  return parts.map((part, i) => {
    const isBold = part.startsWith("**") && part.endsWith("**") && part.length > 4;
    return {
      _type: "span",
      _key: `span-${blockIndex}-${i}`,
      text: isBold ? part.slice(2, -2) : part,
      marks: isBold ? ["strong"] : [],
    };
  });
}

// Converts plain text (with lightweight markdown: "# " H1, "## " H2, "### " H3,
// "**bold**") into Portable Text blocks. Paragraphs are separated by a blank line.
function textToBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph, i) => {
      let style = "normal";
      let content = paragraph;

      const h3Match = paragraph.match(/^###\s+(.*)/);
      const h2Match = paragraph.match(/^##\s+(.*)/);
      const h1Match = paragraph.match(/^#\s+(.*)/);

      if (h3Match) {
        style = "h3";
        content = h3Match[1];
      } else if (h2Match) {
        style = "h2";
        content = h2Match[1];
      } else if (h1Match) {
        style = "h1";
        content = h1Match[1];
      }

      return {
        _type: "block",
        _key: `block-${i}`,
        style,
        markDefs: [],
        children: parseInline(content, i),
      };
    });
}

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
    body: textToBlocks(contentText),
    publishedAt: new Date(publishedAt).toISOString(),
    readTime,
    categories: [{ _type: "reference", _ref: categoryId, _key: categoryId }],
    author: { _type: "reference", _ref: authorId },
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    mainImage: {
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
    body: textToBlocks(contentText),
    publishedAt: new Date(publishedAt).toISOString(),
    readTime,
    categories: [{ _type: "reference", _ref: categoryId, _key: categoryId }],
    author: { _type: "reference", _ref: authorId },
    tags: tagIds.map((id) => ({ _type: "reference", _ref: id, _key: id })),
    ...(coverImageAlt ? { "mainImage.alt": coverImageAlt } : {}),
  });

  const coverAsset = await uploadCoverImageIfProvided(formData);
  if (coverAsset) {
    await patch
      .set({
        mainImage: {
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