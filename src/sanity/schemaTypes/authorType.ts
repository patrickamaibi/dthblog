// --- Authors ---

import { client } from "../lib/client";

export interface Author {
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatar?: string;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const author = await client.fetch(
    /* groq */ `
    *[_type == "author" && slug.current == $slug][0] {
      name,
      "slug": slug.current,
      role,
      "bio": pt::text(bio),
      "avatar": image.asset->url
    }
  `,
    { slug }
  );

  if (author) return author;

  return null;
}

export async function getPostsByAuthor(
  authorSlug: string
): Promise<Array<{ author?: { slug?: string } }>> {
  const all = await client.fetch<Array<{ author?: { slug?: string } }>>(
    /* groq */ `*[_type == "post"]`
  );
  return all.filter((p) => p.author?.slug === authorSlug);
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const sanitySlugs: string[] = await client.fetch(
    /* groq */ `*[_type == "author" && defined(slug.current)].slug.current`
  );

  return Array.from(new Set(sanitySlugs));
}