import * as Sentry from '@sentry/nextjs'

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'

/**
 * Only initialize Sentry in production to avoid any overhead
 * https://docs.sentry.io/platforms/javascript/configuration/options/#enabled
 */
if (environment === 'production') {
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_URL,

		// Add optional integrations for additional features
		integrations: [Sentry.replayIntegration()],

		environment,

		// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
		tracesSampleRate: 0.2,
		profilesSampleRate: 0.1,

		// Define how likely Replay events are sampled.
		// This sets the sample rate to be 10%. You may want this to be 100% while
		// in development and sample at a lower rate in production
		replaysSessionSampleRate: 0.1,

		// Define how likely Replay events are sampled when an error occurs.
		replaysOnErrorSampleRate: 0.1,

		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,

		// Enable source map support for better error tracking
		beforeSend(event) {
			// Ensure source maps are properly processed
			return event
		},
	})
}
