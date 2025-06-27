/* eslint-disable no-constant-condition */

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
	> & {
		signal?: AbortSignal
	}
) {
	const { stop, delay, signal, ...rest } = params

	while (true) {
		if (signal?.aborted) {
			return null
		}

		const data = await fetchAPI<
			ResponseDataT,
			UrlParamsT,
			BodyParamsT,
			QueryParamsT
		>(rest)

		if (stop(data)) {
			return data
		}

		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(resolve, delay)
			if (signal) {
				const abortHandler = () => {
					clearTimeout(timeout)
					reject(new Error('Adaptation aborted'))
				}
				signal.addEventListener('abort', abortHandler, { once: true })
			}
		})
	}
}
