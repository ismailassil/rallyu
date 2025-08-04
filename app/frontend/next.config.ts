import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4025",
        pathname: "/api/users/avatars/*",
      },
    ],
  },
};

export default nextConfig;
