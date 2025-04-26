'use client'

import React, { useEffect } from 'react'
import { colorOptions, USER_SELECTED_COLOR } from '@/constants/global-constants'
import { SocketProvider } from '@/hooks/use-socket'
import { SocketStreamingProvider } from '@/hooks/use-socket-streaming'
import Player from '@/page-builders/plate-editor/player'
import { updateUserData } from '@/store/global-store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { TooltipProvider } from '@/components/plate-ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { PlayerProvider } from '@/providers/player-provider'
import { PollingProvider } from '@/providers/polling-provider'
import { queryClient } from '@/lib/get-query-client'

import { SessionData } from '@/types/admin-types'
import { TColorKey } from '@/types/editor-types'

const AppProvider = ({
	session,
	children,
}: {
	children: React.ReactNode
	session: SessionData | null
}) => {
	useEffect(() => {
		updateUserData(session)
	}, [session])

	useEffect(() => {
		const selectedColor = localStorage.getItem(USER_SELECTED_COLOR) as
			| TColorKey
			| undefined
		if (!selectedColor || !colorOptions[selectedColor]) return

		document.documentElement.style.setProperty(
			'--primary',
			colorOptions[selectedColor].value
		)
		document.documentElement.style.setProperty(
			'--secondary',
			colorOptions[selectedColor].secondary
		)
	}, [])

	return (
		<SessionProvider session={session}>
			<NuqsAdapter>
				<SocketProvider baseUrl="https://handled-split-setup-impression.trycloudflare.com">
					<SocketStreamingProvider baseUrl="https://handled-split-setup-impression.trycloudflare.com">
						<PollingProvider>
							<QueryClientProvider client={queryClient}>
								<ThemeProvider
									attribute="class"
									defaultTheme="dark"
									enableSystem
									disableTransitionOnChange
								>
									<TooltipProvider
										disableHoverableContent
										delayDuration={500}
										skipDelayDuration={0}
									>
										<NextTopLoader color="hsl(var(--primary))" />
										<PlayerProvider>
											<Player />
											{children}
										</PlayerProvider>
										<Toaster />
										<ReactQueryDevtools />
									</TooltipProvider>
								</ThemeProvider>
							</QueryClientProvider>
						</PollingProvider>
					</SocketStreamingProvider>
				</SocketProvider>
			</NuqsAdapter>
		</SessionProvider>
	)
}

export default AppProvider
