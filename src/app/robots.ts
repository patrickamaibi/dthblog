// src/app/robots.ts
import type { MetadataRoute } from "next";

const BASE = "https://blog.discoverytechhub.com";

// Paths no crawler should fetch. Repeated in every group below, because a
// crawler that matches a named group ignores the "*" group entirely.
const PRIVATE_PATHS = ["/admin", "/api", "/blogdth", "/Y"];

// Bots that fetch pages to answer a user's question inside AI search tools.
// These are the ones that send readers and citations your way.
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

// Bots that collect content for model training. Delete a name from this list
// (or the whole group) if you don't want your articles used for training.
const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_SEARCH_BOTS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_TRAINING_BOTS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}