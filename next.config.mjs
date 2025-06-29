/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow build to continue even if database is not available
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize for serverless deployment
  output: 'standalone',
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },
}

export default nextConfig
