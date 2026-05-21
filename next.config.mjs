/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  assetPrefix: '/lending',
  
  async redirects() {
    return [
      {
        source     : '/',
        destination: '/about',
        permanent  : true,
      },
    ];
  },
};

export default nextConfig;
