import {
	COMMON_SITE_HEADERS,
	CORRELATION_ID_HEADER_KEY,
	FETCH_TIMEOUT,
	IGNORE_ERROR_API_URLS,
	validResponseStatuses,
} from '@/constants/global-constants'
import * as Sentry from '@sentry/nextjs'
import { v4 as uuid } from 'uuid'

import { getUserSession } from '@/lib/get-session'
import { log } from '@/lib/utils/helpers'

import { TNoParams } from '@/types/common'

export type FetchRequestParams<
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	BodyParamsT = TNoParams,
	QueryParamsT = TNoParams,
> = {
	baseUrl?: string
	body?: BodyParamsT
	defaultData?: ResponseDataT
	headers?: Record<string, string>
	ignoreError?: boolean
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	noAuth?: boolean
	query?: QueryParamsT
	sendLog?: string
	throwOnError?: boolean
	url: string
	urlParams?: UrlParamsT
}

export type FetchResponseResult<ResponseDataT = TNoParams> =
	| {
			data: ResponseDataT
			error: null
			headers?: Record<string, string>
			status: number
			success: true
	  }
	| {
			data: null | ResponseDataT
			error: Error
			message?: Record<string, string>
			status: number
			success: false
	  }

export async function fetchAPI<
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	BodyParamsT = TNoParams,
	QueryParamsT = TNoParams,
>(
	params: FetchRequestParams<
		ResponseDataT,
		UrlParamsT,
		BodyParamsT,
		QueryParamsT
	>
): Promise<FetchResponseResult<ResponseDataT>> {
	const session = await getUserSession()

	const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || ''
	const {
		url,
		method,
		urlParams = {},
		query = {},
		body = {},
		headers = {},
		defaultData,
		throwOnError,
		baseUrl,
		noAuth,
		sendLog,
		ignoreError,
	} = params

	const sendError = !ignoreError && !IGNORE_ERROR_API_URLS.has(url)

	const BASE_URL = baseUrl ?? process.env.NEXT_PUBLIC_BACKEND_URL

	if (!BASE_URL) {
		throw new Error('Backend URL not set in env!')
	}

	let resolvedUrl = BASE_URL + url
	for (const key in urlParams as Record<string, string>) {
		const value = (urlParams as Record<string, string>)[key]
		resolvedUrl = resolvedUrl
			.replace(`:${key}`, value.toString())
			.replace(`[${key}]`, value.toString())
	}

	const filteredQuery = Object.fromEntries(
		Object.entries(query as Record<string, string>).filter(
			([, value]) => !!value
		)
	)

	const queryStr = new URLSearchParams(
		filteredQuery as Record<string, string>
	).toString()
	if (queryStr) {
		resolvedUrl += `?${queryStr}`
	}
	const accessToken = session?.accessToken || ''
	const correlationId = uuid()

	const defaultSentryTags: Record<string, string> = {
		user_id: String(session?.user?.id),
		user_email: session?.user?.email || 'NA',
		correlationId,
		url,
		method,
	}

	const defaultSentryData: Record<string, string> = {
		user_uid: session?.user?.uid || 'NA',
		accessToken: accessToken ? 'exists' : "doesn't exist",
		body: JSON.stringify(body),
		query: JSON.stringify(query),
		headers: JSON.stringify(headers),
	}

	const startTime = Date.now()
	let timeoutId: NodeJS.Timeout | undefined

	try {
		const isFormData = body instanceof FormData
		if (!accessToken && !noAuth) {
			console.warn('No access token found in session')
			log({
				type: 'API ACCESS_TOKEN ERROR',
				extra: {
					...defaultSentryData,
				},
				tags: defaultSentryTags,
			})
			if (sendError) {
				Sentry.captureException(new Error('API ACCESS_TOKEN ERROR'), {
					extra: defaultSentryData,
					tags: defaultSentryTags,
				})
			}
		}

		timeoutId = setTimeout(() => {
			const duration = Date.now() - startTime
			log({
				type: 'API LONG REQUEST TIMEOUT',
				extra: {
					...defaultSentryData,
					duration,
					timeoutThreshold: FETCH_TIMEOUT,
				},
				tags: defaultSentryTags,
			})
			if (sendError) {
				Sentry.captureException(new Error('API LONG REQUEST TIMEOUT'), {
					extra: {
						...defaultSentryData,
						duration,
						timeoutThreshold: FETCH_TIMEOUT,
					},
					tags: defaultSentryTags,
				})
			}
		}, FETCH_TIMEOUT)

		const response = await fetch(resolvedUrl, {
			method,
			headers: {
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...(noAuth ? {} : { Authorization: `Bearer ${accessToken}` }),
				...(typeof window === 'undefined' ? { 'API-Key': API_KEY } : {}),
				...headers,
				[CORRELATION_ID_HEADER_KEY]: correlationId,
				...COMMON_SITE_HEADERS,
			},
			...(method !== 'GET' && method !== 'DELETE'
				? { body: isFormData ? body : JSON.stringify(body) }
				: {}),
			next: {
				revalidate: 0,
			},
			mode: 'cors',
		})

		clearTimeout(timeoutId)
		const requestDuration = Date.now() - startTime

		if (requestDuration >= FETCH_TIMEOUT) {
			log({
				type: 'API SLOW REQUEST COMPLETED',
				extra: {
					...defaultSentryData,
					duration: requestDuration,
					timeoutThreshold: FETCH_TIMEOUT,
				},
				tags: {
					...defaultSentryTags,
					duration: requestDuration,
				},
			})
			Sentry.captureMessage('API SLOW REQUEST COMPLETED', {
				level: 'warning',
				extra: {
					...defaultSentryData,
					duration: requestDuration,
					timeoutThreshold: FETCH_TIMEOUT,
				},
				tags: {
					...defaultSentryTags,
					duration: requestDuration,
				},
			})
		}

		if (!response.ok || !validResponseStatuses.includes(response.status)) {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}

			log({
				type: 'API RESPONSE ERROR',
				extra: {
					...defaultSentryData,
					responseStatus: response.status,
					responseStatusText: response.statusText,
				},
				tags: defaultSentryTags,
			})
			if (sendError) {
				Sentry.captureException(new Error('API RESPONSE ERROR'), {
					extra: {
						...defaultSentryData,
						responseStatus: response.status,
						responseStatusText: response.statusText,
					},
					tags: defaultSentryTags,
				})
			}

			const message = (await response.json()) as Record<string, string>

			return {
				success: false,
				status: response.status,
				data: defaultData ?? null,
				error: new Error(response.statusText),
				message,
			}
		}

		const responseData = (await response.json()) as ResponseDataT

		if (sendLog) {
			const message = `${sendLog}: ${session?.user.id || 'NA'} - ${resolvedUrl.split(BASE_URL)[1]} - ${new Date().toUTCString()}`
			Sentry.captureMessage(message, 'info')
			log({
				message,
			})
		}

		return {
			success: true,
			status: response.status,
			data: responseData,
			error: null,
		}
	} catch (error) {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		const duration = Date.now() - startTime

		log({
			type: 'API CATCH ERROR',
			extra: {
				...defaultSentryData,
				error: JSON.stringify(error),
			},
			tags: {
				...defaultSentryTags,
				duration,
			},
		})
		if (sendError) {
			const errorTitle =
				duration > FETCH_TIMEOUT ? 'SLOW API CATCH ERROR' : 'API CATCH ERROR'
			Sentry.captureException(new Error(errorTitle), {
				extra: {
					...defaultSentryData,
					error: JSON.stringify(error),
				},
				tags: {
					...defaultSentryTags,
					duration,
				},
			})
		}
		const errorInstance = error as Error

		if (throwOnError) {
			throw errorInstance
		}

		log({ errorInstance })

		return {
			success: false,
			status: 0,
			data: defaultData ?? null,
			error: errorInstance,
		}
	}
}
