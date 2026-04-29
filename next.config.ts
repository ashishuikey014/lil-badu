import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "heic-convert"],
  turbopack: {},
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Expose-Headers",
            value: "X-Original-Size, X-Compressed-Size, X-Saved-Percent",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
