/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qnnvkccawpctdlmehnbd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/peared/**',
      },
    ],
  },
};

module.exports = nextConfig; // Change to module.exports instead of export default
