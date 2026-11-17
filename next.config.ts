import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/media/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "8000",
    pathname: "/media/**",
  },
];

if (process.env.R2_PUBLIC_DOMAIN) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.R2_PUBLIC_DOMAIN,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  async headers() {
    return [
      {
        // Browsers must always see the latest service worker, or users stay
        // stuck on old caching rules.
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
