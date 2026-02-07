import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "**.auth0.com",
      },
      {
        protocol: "https",
        hostname: "webweb.ams3.cdn.digitaloceanspaces.com",
        pathname: "/data/**",
      },
    ],
  },
};

export default nextConfig;
