/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'

import { fetchAPI, FetchRequestParams } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

type StartTaskParams<
	BodyParamsT = TNoParams,
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	QueryParamsT = TNoParams,
> = FetchRequestParams<ResponseDataT, UrlParamsT, BodyParamsT, QueryParamsT> & {
	noCache?: boolean
	onResponse?: (data: ResponseDataT) => void
}

type TSocketContext = {
	getResponse: <T>(taskId: string) => Promise<T>
	startTask: <
		BodyParamsT = TNoParams,
		ResponseDataT = TNoParams,
		UrlParamsT = TNoParams,
		QueryParamsT = TNoParams,
	>(
		params: StartTaskParams<
			BodyParamsT,
			ResponseDataT,
			UrlParamsT,
			QueryParamsT
		>
	) => Promise<string>
}
const SocketContext = createContext<TSocketContext | undefined>(undefined)

export const SocketProvider = ({
	children,
	baseUrl,
}: {
	baseUrl?: string
	children: React.ReactNode
}) => {
	const socketUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || ''
	const [socket] = useState(() =>
		io(socketUrl, {
			autoConnect: false,
		})
	)
	const responsesRef = useRef<Record<string, any>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const [fetchedData, setFetchedData] = useState<Record<string, string>>({})

	useEffect(() => {
		socket.connect()
		socket.onAny((taskId: string, data) => {
			const callback = taskCallbacksRef.current[taskId]
			if (callback) {
				callback(data)
				delete taskCallbacksRef.current[taskId]
			}
			responsesRef.current[taskId] = data
		})
		return () => {
			socket.disconnect()
		}
	}, [socket])

	const startTask: TSocketContext['startTask'] = useCallback(
		async <
			BodyParamsT = TNoParams,
			ResponseDataT = TNoParams,
			UrlParamsT = TNoParams,
			QueryParamsT = TNoParams,
		>(
			params: StartTaskParams<
				BodyParamsT,
				ResponseDataT,
				UrlParamsT,
				QueryParamsT
			>
		) => {
			const { onResponse, noCache, ...restParams } = params
			const key = JSON.stringify(params)
			if (fetchedData[key] && !noCache) {
				return fetchedData[key]
			}
			const taskId = nanoid()
			setFetchedData((prev) => ({ ...prev, [key]: taskId }))
			if (onResponse) {
				taskCallbacksRef.current[taskId] = onResponse
			}

			const resp = await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & { task_id: string }
			>({
				...(baseUrl ? { baseUrl } : {}),
				...restParams,
				query: { task_id: taskId, ...(params.query as QueryParamsT) },
			})

			if (!resp.success) {
				responsesRef.current[taskId] = {
					result: resp,
				}
			}

			return taskId
		},
		[fetchedData, baseUrl]
	)

	const getResponse = useCallback(<T,>(taskId: string) => {
		return new Promise<T>((resolve) => {
			const checkResponse = () => {
				if (responsesRef.current[taskId]) {
					resolve(responsesRef.current[taskId].result as T)
				}
			}

			checkResponse()

			const interval = setInterval(() => {
				checkResponse()
				if (responsesRef.current[taskId]) {
					clearInterval(interval)
				}
			}, 500)
		})
	}, [])

	return (
		<SocketContext.Provider value={{ startTask, getResponse }}>
			{children}
		</SocketContext.Provider>
	)
}

const useSocket = () => {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider')
	}
	return context
}

export default useSocket
