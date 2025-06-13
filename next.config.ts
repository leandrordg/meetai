import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.15.6:3000"],
};

export default nextConfig;
