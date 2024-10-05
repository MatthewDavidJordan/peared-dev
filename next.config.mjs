/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thomasforbes.com',
        port: '',
        pathname: '/wine.png',
      },
    ],
  },
};

export default nextConfig;
