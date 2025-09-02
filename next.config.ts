import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // i18n configuration
  i18n: {
    locales: ["en", "he"], // 'en' for English, 'he' for Hebrew
    defaultLocale: "en", // Set the default language
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "djiruwzwwctgyuutzppj.supabase.co",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Body parser configuration should be at root level
  bodyParser: {
    sizeLimit: "10mb",
  },
};

export default nextConfig;
