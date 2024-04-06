/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1:8000",
      },
    ],
  },
};

export default nextConfig;
