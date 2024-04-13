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
      {
        protocol: "http",
        hostname: "localhost:8000",
      },
      {
        protocol: "https",
        hostname: "a47b4fa647b5c8c98f04f720c123e23d.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
