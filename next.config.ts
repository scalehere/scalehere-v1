import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN origins for testing on physical devices — Next.js 16 blocks cross-origin /_next/* by default.
  allowedDevOrigins: ['192.168.1.153'],
};

export default nextConfig;
