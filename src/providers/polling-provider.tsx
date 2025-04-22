import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useRef,
} from 'react'

import {
	fetchAPI,
	FetchRequestParams,
	FetchResponseResult,
} from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

type StartPollingParams<
	BodyParamsT = TNoParams,
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	QueryParamsT = TNoParams,
> = FetchRequestParams<ResponseDataT, UrlParamsT, BodyParamsT, QueryParamsT> & {
	delay: number
	onResponse?: (
		data: FetchResponseResult<ResponseDataT>
	) => void | Promise<void>
	pollingKey: string
}

type TPollingContext = {
	poll: <
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) => any
	stopPolling: (pollingKey: string) => void
}

const PollingContext = createContext<TPollingContext | undefined>(undefined)

export const PollingProvider = ({ children }: { children: ReactNode }) => {
	const pollingRequestsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

	const stopPolling = useCallback((pollingKey: string) => {
		const intervalId = pollingRequestsRef.current.get(pollingKey)
		if (intervalId) {
			clearInterval(intervalId)
			pollingRequestsRef.current.delete(pollingKey)
		}
	}, [])

	const poll = useCallback(
		<
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
		) => {
			const { pollingKey, onResponse, delay, ...rest } = params
			if (pollingRequestsRef.current.has(pollingKey)) {
				return
			}

			const fetchData = async () => {
				try {
					const data = await fetchAPI<
						ResponseDataT,
						UrlParamsT,
						BodyParamsT,
						QueryParamsT
					>(rest)
					await onResponse?.(data)
				} catch (error) {
					console.error(`Polling error for ${pollingKey}: ${String(error)}`)
					stopPolling(pollingKey)
				}
			}

			void fetchData()

			const intervalId = setInterval(() => void fetchData(), delay)
			pollingRequestsRef.current.set(pollingKey, intervalId)

			return () => {
				clearInterval(intervalId)
				pollingRequestsRef.current.delete(pollingKey)
			}
		},
		[stopPolling]
	)

	return (
		<PollingContext.Provider value={{ poll, stopPolling }}>
			{children}
		</PollingContext.Provider>
	)
}

const usePolling = (): TPollingContext => {
	const context = useContext(PollingContext)
	if (!context) {
		throw new Error('usePolling must be used within a PollingProvider')
	}
	return context
}

export default usePolling
