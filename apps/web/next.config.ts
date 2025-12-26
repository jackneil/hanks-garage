import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Transpile three.js for proper bundling
  transpilePackages: ["three"],
};

export default nextConfig;
