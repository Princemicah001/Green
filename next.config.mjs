/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Set false for stable Three.js WebGL canvas initialization without double-mounting
  images: {
    domains: [],
  },
};

export default nextConfig;
