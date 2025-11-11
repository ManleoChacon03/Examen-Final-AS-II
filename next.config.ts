// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icones.pro',
      },
      {
        protocol: 'https',
        hostname: 'productoscolcar.com',
      },
    ],
  },
  
  // ¡AÑADE ESTO!
  // Esto le dice a Next.js que maneje la dependencia de Clarifai correctamente
  experimental: {
    serverComponentsExternalPackages: ['clarifai-nodejs-grpc'],
  },
};

module.exports = nextConfig;