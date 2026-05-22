import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/sell-out" : undefined,
  assetPrefix: isGithubPages ? "/sell-out/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
