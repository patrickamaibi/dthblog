import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    // Belt and braces for private routes: robots.txt already asks crawlers to
    // stay out, and this tells any engine that reaches one not to index it.
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/admin/:path*", headers: noindex },
      { source: "/blogdth/:path*", headers: noindex },
      { source: "/Y/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
