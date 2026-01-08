import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
	crossOrigin: 'anonymous',
	experimental: {
		serverActions: {
			bodySizeLimit: '1000mb',
		},
	},
	images: {
		unoptimized: true,
		minimumCacheTTL: 259200,
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
			{
				protocol: 'https',
				hostname: 'picsum.photos',
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
			{
				source: '/js/:path*',
				locale: false,
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=2592000, immutable',
					},
				],
			},
			{
				source: '/:all*(svg|jpg|png|jpeg|gif|webp)',
				locale: false,
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				// matching all API routes
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Private-Network', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' }, // replace this with your actual origin
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
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

export default withSentryConfig(nextConfig, {
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
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,

	sourcemaps: {
		deleteSourcemapsAfterUpload: true,
	},
})
