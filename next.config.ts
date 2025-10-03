import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Uncomment and set basePath when deploying to GitHub Pages
  // basePath: '/react-on-steroids',
  // assetPrefix: '/react-on-steroids',
};

export default nextConfig;
