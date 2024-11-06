/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
