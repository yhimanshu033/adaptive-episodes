import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
  },
  // Enable source maps for better error tracking
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/prod-pocketfm-generative-ai/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
        port: '',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'pocketfm',
  project: 'copilot',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  // Source map configuration for better error tracking
  sourcemaps: {
    disable: false,
    // Upload source maps to Sentry
    uploadSourceMaps: true,
    // Include source maps in the build
    include: ['./src/**/*'],
    // Ignore node_modules and other unnecessary files
    ignore: ['node_modules/**', '.next/**'],
    // Set the URL prefix for source maps
    urlPrefix: '~/_next/',
    // Set the release version for better tracking
    release: process.env.SENTRY_RELEASE || 'cowriter@1.2.0',
    // Delete from client after upload
    deleteSourcemapsAfterUpload: true,
  },
})
