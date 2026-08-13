import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @param {string} phase */
export default function nextConfig(phase) {
 return {
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next-build",
  reactStrictMode: true,
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
 };
}
