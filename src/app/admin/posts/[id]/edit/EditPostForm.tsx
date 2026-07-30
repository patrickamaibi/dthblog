"use client";

import { PostForm } from "@/components/admin/PostForm";

export function EditPostForm({
  post,
  authors,
  categories,
  tags,
}: {
  post: any;
  authors: any[];
  categories: any[];
  tags: any[];
}) {
  return (
    <PostForm
      postId={post._id}
      authors={authors}
      categories={categories}
      tags={tags}
      initial={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        authorId: post.authorId,
        categoryIds: post.categoryIds ?? [],
        tagIds: post.tagIds ?? [],
        coverImageUrl: post.coverImageUrl,
        coverImageAlt: post.coverImageAlt,
        gallery: post.gallery ?? [],
      }}
    />
  );
}