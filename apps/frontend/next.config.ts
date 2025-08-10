import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false, // ✅ Disables the "N" button in development
  },
};

export default nextConfig;
