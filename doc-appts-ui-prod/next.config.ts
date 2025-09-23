import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx'],
  experimental: {
    serverActions: {
      allowedOrigins: ['https://localhost:443/', 'http://localhost:3000/']
    }
  }
};

export default nextConfig;
