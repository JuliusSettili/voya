import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';
const projectName = 'voya';

const nextConfig: NextConfig = {
  basePath: isProd ? `/${projectName}` : '',
  assetPrefix: isProd ? `/${projectName}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
