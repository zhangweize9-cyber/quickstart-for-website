import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
};

const withNextra = nextra({
  // ... Add Nextra-specific options here
});

export default withNextra(nextConfig);
