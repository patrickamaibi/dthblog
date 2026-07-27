"use client";

import { usePathname } from "next/navigation";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function NewsletterPopupGate() {
  const pathname = usePathname();

  // Normalize: strip a trailing slash (except for root itself) so "/"
  // and "" both count as the homepage, regardless of how Next reports it.
  const normalized = pathname?.replace(/\/+$/, "") || "/";

  // Don't show the newsletter popup on the homepage.
  if (normalized === "/" || normalized === "") return null;

  return <NewsletterPopup />;
}