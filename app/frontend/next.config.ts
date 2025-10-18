import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api-gateway",
        port: "4025",
        pathname: "/api/users/avatars/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
