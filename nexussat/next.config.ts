import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @uiw/react-md-editor SSR compatibility
  transpilePackages: ["@uiw/react-md-editor", "@uiw/react-markdown-preview"],
};

export default nextConfig;
