import type { Metadata, Viewport } from "next";
import "./globals.css";

// System font stacks used in place of next/font/google (Inter, JetBrains Mono).
// This avoids the dev-time fetch to fonts.googleapis.com — same CSS variable
// names (--font-inter, --font-jetbrains-mono) are kept so nothing downstream
// (Tailwind config, globals.css) needs to change.
const fontVariables = {
  "--font-inter":
    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  "--font-jetbrains-mono":
    "ui-monospace, 'SF Mono', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
} as React.CSSProperties;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A1F44" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1F44" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.discoverytechhub.com"),
  title: {
    default: "DiscoveryTech Hub Blog",
    template: "%s | DiscoveryTech Hub",
  },
  description: "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.",
  keywords: ["technology", "Nigeria", "Africa", "ICT", "digital transformation", "engineering", "design"],
  authors: [{ name: "DiscoveryTech Hub", url: "https://discoverytechhub.com" }],
  creator: "DiscoveryTech Hub",
  publisher: "DiscoveryTech Hub",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "DiscoveryTech",
  },
  openGraph: {
    title: "DiscoveryTech Hub Blog",
    description: "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.",
    url: "https://blog.discoverytechhub.com",
    siteName: "DiscoveryTech Hub Blog",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiscoveryTech Hub Blog",
    description: "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.",
    site: "@disctechhub", // ← confirm this handle exists before launch
    creator: "@disctechhub",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://blog.discoverytechhub.com",
    types: { "application/rss+xml": "https://blog.discoverytechhub.com/feed.xml" },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: "", // ← Search Console verification code (Section 5 requires this wired up)
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DiscoveryTech Hub",
  url: "https://discoverytechhub.com",
  logo: "https://blog.discoverytechhub.com/logonav.png",
  sameAs: [
    "https://web.facebook.com/disctechhub",
    "https://x.com/disctechhub",
    "https://www.linkedin.com/company/discoverytechhub",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" style={fontVariables} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}