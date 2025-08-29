// next.config.js
const { i18n } = require('./next-i18next.config'); // If using next-i18next

const nextConfig = {
  // Keep your existing config
  i18n: {
    locales: ['en', 'he'],
    defaultLocale: 'en',
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

module.exports = nextConfig;