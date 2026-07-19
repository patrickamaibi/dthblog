import "server-only";
import { createClient } from "@sanity/client";

/**
 * Write-capable client — uses SANITY_API_TOKEN (server-only, never
 * exposed to the browser). Only import this from server components,
 * server actions, or API routes — never from client components.
 */
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});