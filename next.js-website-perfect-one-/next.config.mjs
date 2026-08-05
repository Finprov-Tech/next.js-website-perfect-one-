const cmsApiUrl = new URL(process.env.NEXT_PUBLIC_CMS_API_URL || 'http://127.0.0.1:8000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev',
      },
      {
        protocol: cmsApiUrl.protocol.replace(':', ''),
        hostname: cmsApiUrl.hostname,
        port: cmsApiUrl.port || undefined,
      },
    ],
  },
};

export default nextConfig;
