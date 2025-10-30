'use server'

import { headers as nextHeaders } from 'next/headers'

import { fetchAPI } from '@/lib/fetch-api'

export const fetchAPIServer: typeof fetchAPI = async (params) => {
	const nextHeadersObj = await nextHeaders()
	const forwardedFor = nextHeadersObj.get('x-forwarded-for') || ''
	const realIp = nextHeadersObj.get('x-real-ip') || ''

	const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || ''

	return fetchAPI({
		...params,
		headers: {
			'API-Key': API_KEY,
			'x-forwarded-for': forwardedFor,
			'x-real-ip': realIp,
			...params.headers,
		},
	})
}
