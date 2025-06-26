/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080',
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 