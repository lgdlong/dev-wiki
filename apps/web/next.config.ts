import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  // Disable Next.js Development Toolbar in production
  devIndicators: {
    buildActivity: process.env.NODE_ENV === "development",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      // tùy bạn có dùng các host này không, thêm để chắc:
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "i1.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "i2.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "i3.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
