import React, { useEffect, useMemo, useRef } from 'react'
import {
	COMMON_SITE_HEADERS,
	CORRELATION_ID_HEADER_KEY,
	FETCH_TIMEOUT,
	MAX_SOCKET_RETRIES,
	SOCKET_ERROR_TOAST_ID,
} from '@/constants/global-constants'
import { useGlobalStore } from '@/store/global-store'
import * as Sentry from '@sentry/nextjs'
import { X } from 'lucide-react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { Button } from '@/components/aural-ui/button'

function useSocketUtilFn({ baseUrl }: { baseUrl?: string }) {
	const socketUrl =
		baseUrl ||
		process.env.NEXT_PUBLIC_SOCKET_URL ||
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		''
	const { userData } = useGlobalStore()
	const correlationId = useMemo(() => {
		return uuid()
	}, [])
	const failedCounterRef = useRef(0)
	const socket = useMemo(
		() =>
			io(socketUrl, {
				autoConnect: false,
				extraHeaders: {
					Authorization: `Bearer ${userData?.accessToken}`,
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
		[socketUrl, userData, correlationId]
	)

	useEffect(() => {
		socket.connect()

		function handleSocketConnectionError(err: Error) {
			failedCounterRef.current = failedCounterRef.current + 1
			if (failedCounterRef.current === MAX_SOCKET_RETRIES) {
				Sentry.captureException(
					new Error(`Socket retry limit(${MAX_SOCKET_RETRIES}) reached`),
					{
						extra: {
							error: err,
							socketUrl,
							user: userData?.user?.id,
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
		}
		socket.on('connect_error', handleSocketConnectionError)

		function handleSocketConnection() {
			failedCounterRef.current = 0
		}
		socket.on('connect', handleSocketConnection)

		return () => {
			socket.off('connect_error', handleSocketConnectionError)
			socket.off('connect', handleSocketConnection)
			socket.disconnect()
		}
	}, [socket, socketUrl, userData])

	return {
		socket,
	}
}

type TSocketUtil = ReturnType<typeof useSocketUtilFn>

const SocketUtilContext = React.createContext<TSocketUtil | null>(null)

export function SocketUtilContextProvider({
	children,
	baseUrl,
}: React.PropsWithChildren & { baseUrl?: string }) {
	const value = useSocketUtilFn({ baseUrl })

	return (
		<SocketUtilContext.Provider value={value}>
			{children}
		</SocketUtilContext.Provider>
	)
}

export default function useSocketUtil() {
	const context = React.useContext(SocketUtilContext)
	if (!context) {
		throw new Error('useSocketUtil must be used inside useSocketUtilFn')
	}
	return context
}
