/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      // Create a pattern for youtube thumbnails if needed
      {
         protocol: 'https',
         hostname: 'img.youtube.com',
      },
      {
         protocol: 'https',
         hostname: '**', // Allow any image host for development flexibility
      }
    ],
  },
};

export default nextConfig;
