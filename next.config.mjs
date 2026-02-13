// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    domains: [
      "existing-domain.com",
      "tse3.mm.bing.net",
      "tse2.mm.bing.net",
      "tse4.mm.bing.net",
      "i.ytimg.com",
    ],
  },
};

export default nextConfig;
