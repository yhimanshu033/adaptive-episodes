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
import {
	COMMON_SITE_HEADERS,
	CORRELATION_ID_HEADER_KEY,
	FETCH_TIMEOUT,
	MAX_SOCKET_RETRIES,
	SOCKET_ERROR_TOAST_ID,
	SOCKET_STREAMING_TIMEOUT,
} from '@/constants/global-constants'
import * as Sentry from '@sentry/nextjs'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { Button } from '@/components/aural-ui/button'
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
					onTimeout?: (taskId: string) => void
				}
			) => Promise<string>
			stopTask: (taskId: string) => void
			taskEnded: Record<string, boolean>
			tasksTimedOut: Set<string>
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
	const correlationId = useMemo(() => {
		return uuid()
	}, [])
	const failedCounterRef = useRef(0)
	const socket = useMemo(
		() =>
			io(socketUrl, {
				autoConnect: false,
				extraHeaders: {
					Authorization: `Bearer ${session?.accessToken}`,
					[CORRELATION_ID_HEADER_KEY]: correlationId,
					...COMMON_SITE_HEADERS,
				},
				retries: MAX_SOCKET_RETRIES,
				reconnectionAttempts: MAX_SOCKET_RETRIES,
				requestTimeout: FETCH_TIMEOUT,
				// transports: ['websocket'],
				// auth: {
				// 	token: `${session?.accessToken}`,
				// },
			}),
		[socketUrl, session, correlationId]
	)
	const [responses, setResponses] = useState<Record<string, string[]>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const responsesRef = useRef<Record<string, string[]>>({})
	const blockedTasksRef = useRef<Record<string, boolean>>({})
	const [taskEnded, setTaskEnded] = useState<Record<string, boolean>>({})
	const [fetchedData, setFetchedData] = useState<Record<string, string>>({})
	const timeoutCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({})
	const [tasksTimedOut, setTasksTimedOut] = useState<Set<string>>(new Set())

	useEffect(() => {
		socket.connect()

		socket.on('connect_error', (err) => {
			failedCounterRef.current = failedCounterRef.current + 1
			if (failedCounterRef.current === MAX_SOCKET_RETRIES) {
				Sentry.captureException(
					new Error(`Socket retry limit(${MAX_SOCKET_RETRIES}) reached`),
					{
						extra: {
							error: err,
							socketUrl,
							user: session?.user?.id,
						},
					}
				)
				toast('Unable to connect to streaming server.', {
					id: SOCKET_ERROR_TOAST_ID,
					action: (
						<>
							<Button
								innerClassName="w-30!"
								size="sm"
								onClick={() => {
									window.location.reload()
									toast.dismiss(SOCKET_ERROR_TOAST_ID)
								}}
							>
								Retry
							</Button>
							<X
								className="absolute top-1 right-1 z-10 cursor-pointer"
								onClick={() => toast.dismiss(SOCKET_ERROR_TOAST_ID)}
								size={12}
							/>
						</>
					),
					duration: Infinity,
				})
			}
		})

		socket.on('connect', () => {
			failedCounterRef.current = 0
		})

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
					if (timeoutsRef.current[task_id]) {
						clearTimeout(timeoutsRef.current[task_id])
						delete timeoutsRef.current[task_id]
					}
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
			Object.values(timeoutsRef.current).forEach(clearTimeout)
			timeoutsRef.current = {}
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
				onTimeout?: (taskId: string) => void
			}
		) => {
			const key = JSON.stringify(params)
			const { noCache, onResponse, onTimeout, ...rest } = params
			if (fetchedData[key] && !noCache) {
				return fetchedData[key]
			}

			const taskId = nanoid()
			setFetchedData((prev) => ({ ...prev, [key]: taskId }))
			if (onResponse) {
				taskCallbacksRef.current[taskId] = onResponse
			}
			if (onTimeout) {
				timeoutCallbacksRef.current[taskId] = onTimeout
			}

			socket.emit('subscribe', { task_id: session?.user.id })
			await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & TSocketQueryParams
			>({
				...rest,
				query: {
					task_id: taskId,
					room_id: 'true',
					...(params.query as QueryParamsT),
				},
			})

			const timeoutId = setTimeout(() => {
				const timeoutCallback = timeoutCallbacksRef.current[taskId]
				if (timeoutCallback) {
					timeoutCallback(taskId)
				}

				setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
				setTasksTimedOut((prev) => new Set([...prev, taskId]))
				blockedTasksRef.current[taskId] = true
				delete timeoutsRef.current[taskId]
				delete taskCallbacksRef.current[taskId]
				delete timeoutCallbacksRef.current[taskId]
			}, SOCKET_STREAMING_TIMEOUT)

			timeoutsRef.current[taskId] = timeoutId

			return taskId
		},
		[fetchedData, session, socket]
	)

	const stopTask = useCallback((taskId: string) => {
		blockedTasksRef.current[taskId] = true
		setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
		setResponses((prev) => ({ ...prev, [taskId]: [] }))
		responsesRef.current[taskId] = []

		if (timeoutsRef.current[taskId]) {
			clearTimeout(timeoutsRef.current[taskId])
			delete timeoutsRef.current[taskId]
		}
		delete taskCallbacksRef.current[taskId]
		delete timeoutCallbacksRef.current[taskId]
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
				tasksTimedOut,
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
