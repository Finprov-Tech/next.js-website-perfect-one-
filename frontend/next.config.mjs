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
  async redirects() {
    // finprov.com uses root-level slugs — no /blog/, /courses/, /business/, /career/ prefixes.
    return [
      // Live site canonical URL is /contact/ — the migrated WP slug contact-us is a broken CMS landing page.
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/blog/:slug', destination: '/:slug', permanent: true },
      { source: '/courses/:slug', destination: '/:slug', permanent: true },
      { source: '/business/:program', destination: '/:program', permanent: true },
      { source: '/career/:slug', destination: '/:slug', permanent: true },
    ];
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
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'embla-carousel-react',
    ],
  },
  images: {
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
