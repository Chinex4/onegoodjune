import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/home", permanent: true },
      { source: "/read-pubs/:path*", destination: "/pubs/:path*", permanent: true },
      { source: "/school-of-growth/:path*", destination: "/sog/:path*", permanent: true },
      { source: "/fiction-writing/:path*", destination: "/fiction-course/:path*", permanent: true },
      { source: "/author-consultation/:path*", destination: "/consult/:path*", permanent: true },
      { source: "/launch-spotlight/:path*", destination: "/spotlight/:path*", permanent: true },
      { source: "/blog/:path*", destination: "/pubs/:path*", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
