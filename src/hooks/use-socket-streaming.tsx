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

export const useSocketStreamingUtil = () => {
	const socketUrl = 'http://localhost:5001'
	const [socket] = useState(() =>
		io(socketUrl, {
			autoConnect: false,
		})
	)
	const responsesRef = useRef<Record<string, any[]>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const taskStreamEndRef = useRef<Record<string, boolean>>({})

	useEffect(() => {
		socket.connect()

		socket.onAny((taskId: string, data) => {
			if (!responsesRef.current[taskId]) {
				responsesRef.current[taskId] = []
			}

			if (data.chunk) {
				responsesRef.current[taskId].push(data.chunk)
			}

			if (data.done) {
				taskStreamEndRef.current[taskId] = true
			}

			const callback = taskCallbacksRef.current[taskId]
			if (callback) {
				callback(data)
			}
		})

		return () => {
			socket.disconnect()
		}
	}, [socket])

	const startTask = useCallback(
		(taskData: any, onChunkReceived: any) => {
			const taskId = nanoid()

			if (onChunkReceived) {
				taskCallbacksRef.current[taskId] = onChunkReceived
			}

			socket.emit('start_task', { taskId, ...taskData })
			return taskId
		},
		[socket]
	)

	const getStreamedResponse = useCallback((taskId: string) => {
		return new Promise<string[]>((resolve) => {
			const interval = setInterval(() => {
				if (taskStreamEndRef.current[taskId]) {
					clearInterval(interval)
					resolve(responsesRef.current[taskId] || [])
				}
			}, 500)
		})
	}, [])

	return { startTask, getStreamedResponse }
}

const SocketStreamingContext = createContext<
	typeof useSocketStreamingUtil | undefined
>(undefined)

export const SocketStreamingProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<SocketStreamingContext.Provider value={useSocketStreamingUtil}>
			{children}
		</SocketStreamingContext.Provider>
	)
}

const useSocketStreaming = () => {
	const context = useContext(SocketStreamingContext)
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider')
	}
	return context()
}

export default useSocketStreaming
