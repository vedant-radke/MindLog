import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "media.dev.to",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      config.output = config.output || {};
      config.output.chunkFilename = dev
        ? "chunks/[id].js"
        : "chunks/[id].[contenthash].js";
    }

    return config;
  },
};

export default nextConfig;
