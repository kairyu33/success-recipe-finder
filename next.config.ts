import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Turbopack Configuration
   *
   * @description Set the Turbopack workspace root to the project directory
   * to silence multiple lockfiles warning
   */
  turbopack: {
    root: path.resolve(__dirname),
  },

  /**
   * Output Configuration
   *
   * @description Ensure Prisma files are included in the deployment
   * outputFileTracingIncludes forces Next.js to include Prisma binaries
   */
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },

  /**
   * Experimental Features
   *
   * @description Enable serverComponentsExternalPackages for Prisma
   * This ensures Prisma binaries are included in the deployment
   */
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },

  /**
   * Webpack Configuration
   *
   * @description Exclude Prisma engines from webpack bundling
   * This prevents build errors and ensures binaries are copied correctly
   */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@prisma/client', '@prisma/engines'];
    }
    return config;
  },

  /**
   * Security Headers Configuration
   *
   * @description Comprehensive security headers to protect against common web vulnerabilities
   * - X-Frame-Options: Prevents clickjacking attacks
   * - X-Content-Type-Options: Prevents MIME type sniffing
   * - Referrer-Policy: Controls referrer information
   * - Permissions-Policy: Restricts browser features
   * - Content-Security-Policy: Prevents XSS and injection attacks
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent embedding in iframes (clickjacking protection)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Control referrer information
          },
          {
            key: 'Permissions-Policy',
            // Restrict powerful browser features
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on', // Enable DNS prefetching for performance
          },
          {
            key: 'Strict-Transport-Security',
            // Force HTTPS for 2 years (only in production)
            value: process.env.NODE_ENV === 'production'
              ? 'max-age=63072000; includeSubDomains; preload'
              : 'max-age=0',
          },
          {
            key: 'Content-Security-Policy',
            // Comprehensive CSP to prevent XSS and injection attacks
            value: [
              "default-src 'self'", // Only allow resources from same origin by default
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts (needed for Next.js)
              "style-src 'self' 'unsafe-inline'", // Allow inline styles
              "img-src 'self' data: https:", // Allow images from same origin, data URIs, and HTTPS
              "font-src 'self' data:", // Allow fonts from same origin and data URIs
              "connect-src 'self' https://api.anthropic.com", // API connections
              "frame-src 'self'", // Allow iframes from same origin only
              "frame-ancestors 'none'", // Prevent embedding (backup for X-Frame-Options)
              "form-action 'self'", // Only allow form submissions to same origin
              "base-uri 'self'", // Restrict base tag URLs
              "object-src 'none'", // Disable plugins (Flash, etc.)
              "upgrade-insecure-requests", // Upgrade HTTP to HTTPS automatically
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
