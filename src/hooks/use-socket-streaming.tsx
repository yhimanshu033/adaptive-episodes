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
			stopTask: (taskId: string) => void
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
	const socketUrl =
		baseUrl ||
		process.env.NEXT_PUBLIC_SOCKET_URL ||
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		''
	const { data: session } = useSession()
	const socket = useMemo(
		() =>
			io(socketUrl, {
				autoConnect: false,
				extraHeaders: {
					Authorization: `Bearer ${session?.accessToken}`,
				},
				// transports: ['websocket'],
				// auth: {
				// 	token: `${session?.accessToken}`,
				// },
			}),
		[socketUrl, session]
	)
	const [responses, setResponses] = useState<Record<string, string[]>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const responsesRef = useRef<Record<string, string[]>>({})
	const blockedTasksRef = useRef<Record<string, boolean>>({})
	const [taskEnded, setTaskEnded] = useState<Record<string, boolean>>({})
	const [fetchedData, setFetchedData] = useState<Record<string, string>>({})

	useEffect(() => {
		socket.connect()

		socket.onAny(
			(
				task_id: string,
				payload: {
					chunk?: Record<string, string> | string
					status?: ESocketStatus
					task_id: string
				}
			) => {
				if (blockedTasksRef.current[task_id]) {
					return
				}

				const { chunk, status } = payload

				// Handle task start
				if (status === ESocketStatus.STARTED) {
					setTaskEnded((prev) => ({ ...prev, [task_id]: false }))
				}

				// Handle task completion
				const isCompleted = status === ESocketStatus.COMPLETED || chunk === ';]'
				if (isCompleted && !taskEnded[task_id]) {
					const callback = taskCallbacksRef.current[task_id]
					if (callback) {
						callback(responsesRef.current[task_id])
					}
					setTaskEnded((prev) => ({ ...prev, [task_id]: true }))
				}

				if (!responses) {
					setResponses((prev) => ({ ...prev, [task_id]: [] }))
					responsesRef.current[task_id] = []
				}

				if (!payload.chunk || payload.chunk === ';]') {
					return
				}

				const normalizedChunk =
					typeof chunk === 'object' ? JSON.stringify(chunk) : String(chunk)

				setResponses((prev) => ({
					...prev,
					[task_id]: [...(prev[task_id] || []), String(normalizedChunk)],
				}))

				responsesRef.current[task_id] = [
					...(responsesRef.current[task_id] || []),
					String(normalizedChunk),
				]
			}
		)
		return () => {
			socket.disconnect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

			socket.emit('subscribe', { task_id: String(session?.user.id) })
			await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & TSocketQueryParams
			>({
				...rest,
				query: {
					task_id: taskId,
					room_id: String(session?.user.id),
					...(params.query as QueryParamsT),
				},
			})

			return taskId
		},
		[fetchedData, session, socket]
	)

	const stopTask = useCallback((taskId: string) => {
		blockedTasksRef.current[taskId] = true
		setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
		setResponses((prev) => ({ ...prev, [taskId]: [] }))
		responsesRef.current[taskId] = []
	}, [])

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

	const getStreamedResponseChunks = useCallback(
		(taskId: string) => {
			return responses[taskId] || []
		},
		[responses]
	)

	return (
		<SocketStreamingContext.Provider
			value={{
				startTask,
				getStreamedResponse,
				getStreamedResponseChunks,
				stopTask,
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
