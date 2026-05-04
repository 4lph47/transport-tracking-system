import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Memory optimization settings */
  experimental: {
    // Reduce memory usage
    optimizePackageImports: ['@prisma/client'],
  },
  
  // Optimize production builds
  compress: true,
  
  // Reduce bundle size
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  
  // Reduce serverless function size
  outputFileTracing: true,
};

export default nextConfig;
