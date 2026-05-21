/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

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
