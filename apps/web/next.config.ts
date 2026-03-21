import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@trooper/shared"],
  async redirects() {
    return [
      {
        source: "/new",
        destination: "/create",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
