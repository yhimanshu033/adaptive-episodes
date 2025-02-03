'use server'

import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/next-auth-options'

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
	headers?: Headers
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	noAuth?: boolean
	query?: QueryParamsT
	throwOnError?: boolean
	url: string
	urlParams?: UrlParamsT
}

type FetchResponseResult<ResponseDataT = TNoParams> =
	| {
			data: ResponseDataT
			error: null
			status: number
			success: true
	  }
	| {
			data: null | ResponseDataT
			error: Error
			status: 0
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
	} = params

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

	const queryStr = new URLSearchParams(
		query as Record<string, string>
	).toString()
	if (queryStr) {
		resolvedUrl += `?${queryStr}`
	}
	const accessToken = session?.accessToken || ''

	try {
		const isFormData = body instanceof FormData
		if (!accessToken && !noAuth) {
			console.warn('No access token found in session')
		}
		const response = await fetch(resolvedUrl, {
			method,
			headers: {
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				'API-Key': API_KEY,
				...(noAuth ? {} : { Authorization: `Bearer ${accessToken}` }),
				...headers,
			},
			...(method !== 'GET' && method !== 'DELETE'
				? { body: isFormData ? body : JSON.stringify(body) }
				: {}),
			next: {
				revalidate: 0,
			},
			mode: 'cors',
		})

		if (!response.ok || response.status !== 200) {
			Sentry.captureException(
				JSON.stringify({
					type: 'API RESPONSE ERROR',
					data: {
						url: resolvedUrl,
						method,
						body,
						query,
						accessToken,
						headers,
						responseStatus: response.status,
						responseStatusText: response.statusText,
					},
				})
			)
			return {
				success: false,
				status: 0,
				data: defaultData ?? null,
				error: new Error(response.statusText),
			}
		}

		const responseData = (await response.json()) as ResponseDataT

		return {
			success: true,
			status: response.status,
			data: responseData,
			error: null,
		}
	} catch (error) {
		Sentry.captureException(
			JSON.stringify({
				type: 'API CATCH ERROR',
				data: {
					url: resolvedUrl,
					method,
					body,
					accessToken,
					query,
					headers,
					error,
				},
			})
		)
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
