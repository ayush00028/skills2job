/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'upload.wikimedia.org',
      'cdn.worldvectorlogo.com',
      'assets.getpostman.com'
    ],
  },
};

export default nextConfig;
