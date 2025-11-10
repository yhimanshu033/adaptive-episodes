/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/nextjs'

import { LOCAL_STORAGE_KEYS } from '@/lib/utils/analytics'

export function createRateLimiter(maxRequests: number, windowMs: number) {
	let timestamps: number[] = []

	return async function rateLimited<
		T extends (...args: any[]) => ReturnType<T>,
	>(fn: T, ...args: Parameters<T>): Promise<ReturnType<T>> {
		const now = Date.now()

		// remove timestamps older than window
		timestamps = timestamps.filter((t) => now - t < windowMs)

		if (timestamps.length >= maxRequests) {
			const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.UID) || ''
			Sentry.captureException(
				new Error(
					`Rate limit (requests: ${maxRequests}, window: ${windowMs}ms) reached in the Frontend`
				),
				{
					extra: {
						args,
						userId,
					},
				}
			)
			console.warn('⚠️ Rate limit exceeded on frontend')
			return Promise.reject(new Error('Rate limit exceeded on frontend'))
		}

		timestamps.push(now)
		return fn(...args)
	}
}
