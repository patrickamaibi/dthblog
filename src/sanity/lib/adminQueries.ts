import { adminClient } from "./adminClient";

export async function getAllPostsForAdmin() {
  return adminClient.fetch(/* groq */ `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "category": category->title,
      "author": author->name,
      "coverImageUrl": coverImage.asset->url
    }
  `);
}

export async function getPostByIdForAdmin(id: string) {
  return adminClient.fetch(
    /* groq */ `
    *[_type == "post" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "contentText": pt::text(content),
      publishedAt,
      readTime,
      "categoryId": category->_id,
      "authorId": author->_id,
      "tagTitles": tags[]->title,
      "coverImageUrl": coverImage.asset->url,
      "coverImageAlt": coverImage.alt
    }
  `,
    { id }
  );
}

export async function getAllAuthorsForAdmin() {
  return adminClient.fetch(/* groq */ `
    *[_type == "author"] | order(name asc) { _id, name }
  `);
}

export async function getAllCategoriesForAdmin() {
  return adminClient.fetch(/* groq */ `
    *[_type == "category"] | order(title asc) { _id, title, "slug": slug.current }
  `);
}

export async function getAllTagsForAdmin() {
  return adminClient.fetch(/* groq */ `
    *[_type == "tag"] | order(title asc) { _id, title }
  `);
}
