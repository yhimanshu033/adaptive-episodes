/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from 'react'
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'

import { fetchAPI, FetchRequestParams } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export const useSocketUtil = () => {
	const socketUrl = process.env.NEXT_PUBLIC_SOCKET_BASE_URL || ''
	const socket = io(socketUrl, {
		autoConnect: false,
	})
	const responsesRef = useRef<Record<string, any>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})

	useEffect(() => {
		socket.connect()
		return () => {
			socket.disconnect()
		}
	}, [socket])

	const startTask = useCallback(
		async <
			BodyParamsT = TNoParams,
			ResponseDataT = TNoParams,
			UrlParamsT = TNoParams,
			QueryParamsT = TNoParams,
		>(
			params: FetchRequestParams<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT
			> & {
				onResponse?: (data: ResponseDataT) => void
			}
		) => {
			const taskId = nanoid()

			if (params.onResponse) {
				taskCallbacksRef.current[taskId] = params.onResponse
			}

			socket.on(taskId, (data: ResponseDataT) => {
				const callback = taskCallbacksRef.current[taskId]
				if (callback) {
					callback(data)
					delete taskCallbacksRef.current[taskId]
				}
				responsesRef.current[taskId] = data
			})

			await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & { task_id: string }
			>({
				...params,
				query: { task_id: taskId, ...(params.query as QueryParamsT) },
				baseUrl: process.env.NEXT_PUBLIC_SOCKET_BASE_URL || '',
			})

			return taskId
		},
		[socket]
	)

	const getResponse = useCallback(<T,>(taskId: string) => {
		return new Promise<T>((resolve) => {
			const checkResponse = () => {
				if (responsesRef.current[taskId]) {
					resolve(responsesRef.current[taskId] as T)
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

	return { startTask, getResponse }
}

const SocketContext = createContext<typeof useSocketUtil | undefined>(undefined)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SocketContext.Provider value={useSocketUtil}>
			{children}
		</SocketContext.Provider>
	)
}

const useSocket = () => {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider')
	}
	return context()
}

export default useSocket
