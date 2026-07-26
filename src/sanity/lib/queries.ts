import { client } from "./client";
import {
  POSTS as STATIC_POSTS,
  CATEGORIES as STATIC_CATEGORIES,
  type Post as StaticPost,
} from "@/lib/data";

export type Author = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
};

export type Category = {
  title: string;
  slug: string;
  description?: string;
  order?: number;
  heroImage?: {
    url: string;
    alt?: string;
  } | null;
};

export type Tag = {
  title: string;
  slug: string;
};

export type CoverImage = {
  url: string;
  alt: string;
};

export type PostListItem = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  category: Category;
  tags: Tag[];
  author: Author;
  coverImage: CoverImage;
  isStatic?: boolean;
};

export type PostDetail = PostListItem & {
  body: any; // Portable Text blocks (Sanity posts only)
  htmlContent?: string; // Raw HTML (static/demo posts only)
};

const POST_LIST_PROJECTION = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readTime,
  "category": categories[0]->{
    title,
    "slug": slug.current,
    description,
    order,
    "heroImage": {
      "url": heroImage.asset->url,
      "alt": heroImage.alt
    }
  },
  "tags": tags[]->{title, "slug": slug.current},
  "author": author->{
    name,
    "slug": slug.current,
    role,
    bio,
    "avatar": image.asset->url
  },
  "coverImage": {
    "url": mainImage.asset->url,
    "alt": mainImage.alt
  }
}`;

// --- Adapters: convert static demo posts into the same shape as Sanity posts ---

function staticPostToListItem(p: StaticPost): PostListItem {
  return {
    _id: `static-${p.slug}`,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    readTime: p.readTime,
    category: p.category,
    tags: p.tags,
    author: {
      name: p.author.name,
      slug: p.author.slug,
      role: p.author.role,
      bio: p.author.bio,
      avatar: p.author.avatar,
    },
    coverImage: p.coverImage,
    isStatic: true,
  };
}

function staticPostToDetail(p: StaticPost): PostDetail {
  return {
    ...staticPostToListItem(p),
    body: null,
    htmlContent: p.content,
  };
}

function sortByDateDesc(posts: PostListItem[]): PostListItem[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// --- Posts ---

export async function getAllPosts(): Promise<PostListItem[]> {
  const sanityPosts: PostListItem[] = await client.fetch(
    /* groq */ `
    *[_type == "post" && defined(slug.current) && publishedAt <= now()]
      | order(publishedAt desc) ${POST_LIST_PROJECTION}
  `
  );

  const sanitySlugs = new Set(sanityPosts.map((p) => p.slug));
  const staticPosts = STATIC_POSTS.filter((p) => !sanitySlugs.has(p.slug)).map(
    staticPostToListItem
  );

  return sortByDateDesc([...sanityPosts, ...staticPosts]);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const sanityPost = await client.fetch(
    /* groq */ `
    *[_type == "post" && slug.current == $slug && publishedAt <= now()][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      publishedAt,
      readTime,
      "category": categories[0]->{
        title,
        "slug": slug.current,
        description,
        order,
        "heroImage": {
          "url": heroImage.asset->url,
          "alt": heroImage.alt
        }
      },
      "tags": tags[]->{title, "slug": slug.current},
      "author": author->{
  name,
  "slug": slug.current,
  role,
  "bio": pt::text(bio),
  "avatar": image.asset->url
},
      "coverImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      }
    }
  `,
    { slug }
  );

  if (sanityPost) return sanityPost;

  const staticMatch = STATIC_POSTS.find((p) => p.slug === slug);
  return staticMatch ? staticPostToDetail(staticMatch) : null;
}

export async function getPostsByCategory(categorySlug: string): Promise<PostListItem[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category?.slug === categorySlug);
}

export async function getRelatedPosts(
  currentSlug: string,
  categorySlug: string,
  limit = 3
): Promise<PostListItem[]> {
  const all = await getAllPosts();
  const sameCategory = all.filter(
    (p) => p.slug !== currentSlug && p.category?.slug === categorySlug
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = all.filter(
    (p) => p.slug !== currentSlug && p.category?.slug !== categorySlug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

// --- Categories ---

export async function getAllCategories(): Promise<Category[]> {
  const sanityCategories: Category[] = await client.fetch(/* groq */ `
    *[_type == "category"] | order(order asc) {
      title,
      "slug": slug.current,
      description,
      order,
      "heroImage": {
        "url": heroImage.asset->url,
        "alt": heroImage.alt
      }
    }
  `);

  const sanitySlugs = new Set(sanityCategories.map((c) => c.slug));

  // Explicitly re-shaped into this file's Category type (not the one from
  // lib/data.ts) so TypeScript treats every entry as the same type and
  // `.order` is valid on all of them, even though static entries never set it.
  const staticOnly: Category[] = STATIC_CATEGORIES.filter(
    (c) => !sanitySlugs.has(c.slug)
  ).map((c) => ({
    title: c.title,
    slug: c.slug,
    description: c.description,
    order: undefined,
    heroImage: null,
  }));

  // Sort by the editorial `order` field set in Sanity Studio, not
  // alphabetically. Categories without an order (e.g. leftover static-only
  // entries) fall back to the end of the list rather than breaking the sort.
  return [...sanityCategories, ...staticOnly].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const sanityCategory = await client.fetch(
    /* groq */ `
    *[_type == "category" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      description,
      order,
      "heroImage": {
        "url": heroImage.asset->url,
        "alt": heroImage.alt
      }
    }
  `,
    { slug }
  );

  if (sanityCategory) return sanityCategory;

  return STATIC_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

// --- Utils ---

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}