import { adminClient } from "./adminClient";
export async function getAllTagsForAdmin() {
  return adminClient.fetch(`*[_type == "tag"] | order(title asc){ _id, title }`);
}
export async function getAllPostsForAdmin() {
  return adminClient.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "category": categories[0]->title,
      "author": author->name,
      "coverImageUrl": mainImage.asset->url
    }
  `);
}
export async function getPostByIdForAdmin(id: string) {
  return adminClient.fetch(
    `
    *[_type == "post" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      publishedAt,
      readTime,
      "categoryIds": categories[]->_id,
      "authorId": author->_id,
      "tagIds": tags[]->_id,
      "coverImageUrl": mainImage.asset->url,
      "coverImageAlt": mainImage.alt,
      "gallery": gallery[]{ _key, "url": asset->url }
    }
  `,
    { id }
  );
}
export async function getAllAuthorsForAdmin() {
  return adminClient.fetch(`
    *[_type == "author"] | order(name asc) { _id, name }
  `);
}
export async function getAllCategoriesForAdmin() {
  return adminClient.fetch(`
    *[_type == "category"] | order(title asc) { _id, title, "slug": slug.current }
  `);
}