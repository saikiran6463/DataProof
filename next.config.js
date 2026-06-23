/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API calls to the Spring Boot backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
