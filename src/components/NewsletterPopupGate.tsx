"use client";

import { usePathname } from "next/navigation";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function NewsletterPopupGate() {
  const pathname = usePathname();

  // Don't show the newsletter popup on the homepage.
  if (pathname === "/") return null;

  return <NewsletterPopup />;
}