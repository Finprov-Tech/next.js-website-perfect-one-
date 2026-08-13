import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const cmsApiUrl = new URL(process.env.NEXT_PUBLIC_CMS_API_URL || 'http://127.0.0.1:8000');

/** @type {import('next').NextConfig} */
export default function nextConfig(phase) {
 return {
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next-build',
  reactStrictMode: true,
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Fallback only — runs after every real file-system route (static and
    // dynamic) has already failed to match, so /about, /courses/[slug], etc.
    // are entirely unaffected. Anything left over is a migrated WordPress
    // programmatic SEO landing page, kept at its original top-level URL.
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/:slug',
          destination: '/wp/:slug',
        },
      ],
    };
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
}
