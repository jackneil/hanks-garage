import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Transpile three.js for proper bundling
  transpilePackages: ["three"],

  // Security headers to prevent clickjacking, XSS, MIME sniffing
  async headers() {
    return [
      // Emulator needs to be framed by same origin (retro-arcade game loads it in iframe)
      {
        source: "/emulator/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emulatorjs.org https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://cdn.emulatorjs.org; img-src 'self' data: https: blob:; font-src 'self' data: https://cdn.emulatorjs.org; connect-src 'self' https: blob:; media-src 'self' blob:; worker-src 'self' blob:; frame-ancestors 'self';",
          },
        ],
      },
      // All other routes - strict security (no framing allowed)
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' blob:; worker-src 'self' blob:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
