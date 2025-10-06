'use server'

import { headers as nextHeaders } from 'next/headers'
import {
	FETCH_TIMEOUT,
	validResponseStatuses,
} from '@/constants/global-constants'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/next-auth-options'
import { log } from '@/lib/utils/helpers'

import { SessionData } from '@/types/admin-types'
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
	const session = (await getServerSession(authOptions)) as SessionData

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
	} = params

	const nextHeadersObj = await nextHeaders()
	const forwardedFor = nextHeadersObj.get('x-forwarded-for')
	const realIp = nextHeadersObj.get('x-real-ip')

	const BASE_URL = baseUrl ?? process.env.NEXT_PUBLIC_BACKEND_URL
	const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || ''

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

	const defaultSentryData: Record<string, string> = {
		user: JSON.stringify(session?.user),
		url: resolvedUrl,
		method,
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
			})
			Sentry.captureException(new Error('API ACCESS_TOKEN ERROR'), {
				extra: defaultSentryData,
			})
		}

		timeoutId = setTimeout(() => {
			const duration = Date.now() - startTime
			log({
				type: 'API LONG REQUEST TIMEOUT',
				extra: {
					...defaultSentryData,
					duration,
					timeoutThreshol: FETCH_TIMEOUT,
				},
			})
			Sentry.captureException(new Error('API LONG REQUEST TIMEOUT'), {
				extra: {
					...defaultSentryData,
					duration,
					timeoutThreshol: FETCH_TIMEOUT,
				},
			})
		}, FETCH_TIMEOUT)

		const response = await fetch(resolvedUrl, {
			method,
			headers: {
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				'API-Key': API_KEY,
				...(noAuth ? {} : { Authorization: `Bearer ${accessToken}` }),
				...headers,
				'x-forwarded-for': forwardedFor || '',
				'x-real-ip': realIp || '',
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
					timeoutThreshol: FETCH_TIMEOUT,
				},
			})
			Sentry.captureMessage('API SLOW REQUEST COMPLETED', {
				level: 'warning',
				extra: {
					...defaultSentryData,
					duration: requestDuration,
					timeoutThreshol: FETCH_TIMEOUT,
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
			})
			Sentry.captureException(new Error('API RESPONSE ERROR'), {
				extra: {
					...defaultSentryData,
					responseStatus: response.status,
					responseStatusText: response.statusText,
				},
			})

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
			const message = `${sendLog}: ${session.user.id} - ${resolvedUrl.split(BASE_URL)[1]} - ${new Date().toUTCString()}`
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
			headers: {
				'x-forwarded-for': forwardedFor || '',
				'x-real-ip': realIp || '',
			},
		}
	} catch (error) {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		log({
			type: 'API CATCH ERROR',
			extra: {
				...defaultSentryData,
				error: JSON.stringify(error),
			},
		})
		Sentry.captureException(new Error('API CATCH ERROR'), {
			extra: {
				...defaultSentryData,
				error: JSON.stringify(error),
			},
		})
		const errorInstance = error as Error

		if (throwOnError) {
			throw errorInstance
		}

		console.log({ errorInstance })

		return {
			success: false,
			status: 0,
			data: defaultData ?? null,
			error: errorInstance,
		}
	}
}
