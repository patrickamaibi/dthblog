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

const SITE_URL = "https://blog.discoverytechhub.com";
const MAIN_SITE_URL = "https://discoverytechhub.com";
const DESCRIPTION =
  "Sharp thinking on ICT, digital transformation, and technology in Nigeria and Africa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DiscoveryTech Hub Blog",
    template: "%s | DiscoveryTech Hub",
  },
  description: DESCRIPTION,
  authors: [{ name: "DiscoveryTech Hub", url: MAIN_SITE_URL }],
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
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "DiscoveryTech Hub Blog",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiscoveryTech Hub Blog",
    description: DESCRIPTION,
    site: "@disctechhub", // ← confirm this handle exists
    creator: "@disctechhub",
    images: ["/og.png"],
  },
  // No canonical here on purpose: a canonical in the root layout is inherited by
  // every page that doesn't set its own, which points them all at the homepage.
  // Each page sets its own canonical in its own metadata.
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${MAIN_SITE_URL}/#organization`,
      name: "DiscoveryTech Hub",
      url: MAIN_SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logonav.png`,
      },
      sameAs: [
        "https://www.facebook.com/disctechhub",
        "https://x.com/disctechhub",
        "https://www.linkedin.com/company/discoverytechhub",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "DiscoveryTech Hub Blog",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${MAIN_SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" style={fontVariables} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
