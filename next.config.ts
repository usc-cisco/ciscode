import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  trailingSlash: false,
};

export default nextConfig;
