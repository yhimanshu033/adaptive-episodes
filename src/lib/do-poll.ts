import { fetchAPI } from '@/lib/fetch-api'

import { StartPollingParams, TNoParams } from '@/types/common'

export async function doPoll<
	BodyParamsT = TNoParams,
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	QueryParamsT = TNoParams,
>(
	params: StartPollingParams<
		BodyParamsT,
		ResponseDataT,
		UrlParamsT,
		QueryParamsT
	>
) {
	const { stop, delay, ...rest } = params
	let cancelled = false
	while (!cancelled) {
		const data = await fetchAPI<
			ResponseDataT,
			UrlParamsT,
			BodyParamsT,
			QueryParamsT
		>(rest)
		if (stop(data)) {
			cancelled = true
			return data
		} else {
			await new Promise((resolve) => setTimeout(resolve, delay))
		}
	}
}
