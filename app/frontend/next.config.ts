import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        // pathname: '/path/to/images/**', // Optional: restrict to specific paths
      },
    ],
  },
};

export default nextConfig;
