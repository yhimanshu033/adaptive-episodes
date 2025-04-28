/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { ESocketStatus } from '@/constants/ai-constants'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'

import { fetchAPI, FetchRequestParams } from '@/lib/fetch-api'

import { TNoParams, TSocketQueryParams } from '@/types/common'

type TSocketStreamingContext =
	| {
			getStreamedResponse: (taskId: string) => Promise<string[]>
			getStreamedResponseChunks: (taskId: string) => any[]
			responses: Record<string, string[]>
			startTask: <
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
					noCache?: boolean
					onResponse?: (data: ResponseDataT) => void
				}
			) => Promise<string>
			taskEnded: Record<string, boolean>
	  }
	| undefined

const SocketStreamingContext = createContext<TSocketStreamingContext>(undefined)

export const SocketStreamingProvider = ({
	children,
	baseUrl,
}: {
	baseUrl?: string
	children: React.ReactNode
}) => {
	const socketUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || ''
	const { data: session } = useSession()
	const socket = useMemo(
		() =>
			io(socketUrl, {
				autoConnect: false,
				// extraHeaders: {
				// 	Authorization: `Bearer ${session?.accessToken}`,
				// },
			}),
		[socketUrl]
	)
	const [responses, setResponses] = useState<Record<string, string[]>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const responsesRef = useRef<Record<string, string[]>>({})
	const [taskEnded, setTaskEnded] = useState<Record<string, boolean>>({})
	const [fetchedData, setFetchedData] = useState<Record<string, string>>({})

	useEffect(() => {
		socket.connect()

		socket.onAny(
			(
				task_id: string,
				payload: { chunk?: string; status: ESocketStatus; task_id: string }
			) => {
				if (payload.status) {
					if (payload.status === ESocketStatus.STARTED) {
						setTaskEnded((prev) => ({ ...prev, [task_id]: false }))
					}
					if (payload.status === ESocketStatus.COMPLETED) {
						const callback = taskCallbacksRef.current[task_id]
						if (callback) {
							callback(responsesRef.current[task_id])
						}
						setTaskEnded((prev) => ({ ...prev, [task_id]: true }))
					}
				}
				if (!responses) {
					setResponses((prev) => ({ ...prev, [task_id]: [] }))
					responsesRef.current[task_id] = []
				}
				if (!payload.chunk) {
					return
				}
				setResponses((prev) => ({
					...prev,
					[task_id]: [...(prev[task_id] || []), String(payload.chunk)],
				}))
				responsesRef.current[task_id] = [
					...(responsesRef.current[task_id] || []),
					String(payload.chunk),
				]
			}
		)
		if (!session?.user.id) {
			return
		}
		// socket.on('connect', () => {
		// 	socket.emit('subscribe', { "task_id": String(session?.user.id) })
		// })
		return () => {
			// socket.emit('unsubscribe', String(session?.user.id))
			socket.disconnect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, session])

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
				noCache?: boolean
				onResponse?: (data: ResponseDataT) => void
			}
		) => {
			const key = JSON.stringify(params)
			const { noCache, onResponse, ...rest } = params
			if (fetchedData[key] && !noCache) {
				return fetchedData[key]
			}
			const taskId = nanoid()
			setFetchedData((prev) => ({ ...prev, [key]: taskId }))
			if (onResponse) {
				taskCallbacksRef.current[taskId] = onResponse
			}

			await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & TSocketQueryParams
			>({
				// ...(baseUrl ? { baseUrl } : {}),
				...rest,
				query: {
					task_id: taskId,
					// room_id: String(session?.user.id),
					...(params.query as QueryParamsT),
				},
			})

			return taskId
		},
		[fetchedData]
	)

	const getStreamedResponse = useCallback(
		(taskId: string) => {
			return new Promise<string[]>((resolve) => {
				const interval = setInterval(() => {
					if (taskEnded[taskId]) {
						clearInterval(interval)
						resolve(responses[taskId] || [])
					}
				}, 500)
			})
		},
		[responses, taskEnded]
	)

	const getStreamedResponseChunks = (taskId: string) => {
		return responses[taskId] || []
	}

	return (
		<SocketStreamingContext.Provider
			value={{
				startTask,
				getStreamedResponse,
				getStreamedResponseChunks,
				responses,
				taskEnded,
			}}
		>
			{children}
		</SocketStreamingContext.Provider>
	)
}

const useSocketStreaming = () => {
	const context = useContext(SocketStreamingContext)
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider')
	}
	return context
}

export default useSocketStreaming
