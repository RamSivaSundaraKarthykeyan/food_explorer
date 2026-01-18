import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/off-api/:path*',
        destination: 'https://world.openfoodfacts.org/:path*',
      },
    ];
  },
};

export default nextConfig;