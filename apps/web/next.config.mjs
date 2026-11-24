/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/apps/player-demo/index.html" },
      { source: "/studio", destination: "/apps/studio/admin.html" },
    ];
  },
};

export default nextConfig;
