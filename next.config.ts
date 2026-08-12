import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 88],
  },
  async headers() {
    return [
      {
        source: "/dashboard",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, nocache",
          },
        ],
      },
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, nocache",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
