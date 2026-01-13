import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost']
    }
  }
};

export default nextConfig;
