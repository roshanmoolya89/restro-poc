import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // true uses a 308 redirect, false uses 307
      },
    ];
  },
};

export default nextConfig;
