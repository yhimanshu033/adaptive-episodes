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

import { Toaster } from '@/components/aural-ui/toast'
import { TooltipProvider } from '@/components/plate-ui-v2/tooltip'
import { AdaptationProvider } from '@/providers/adaptation-provider'
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
		if (!selectedColor || !colorOptions[selectedColor]) {
			return
		}

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
				<SocketProvider>
					<SocketStreamingProvider>
						<PollingProvider>
							<QueryClientProvider client={queryClient}>
								<ThemeProvider
									attribute="class"
									forcedTheme="dark"
									disableTransitionOnChange
								>
									<TooltipProvider
										disableHoverableContent
										delayDuration={500}
										skipDelayDuration={0}
									>
										<AdaptationProvider>
											<NextTopLoader
												color="var(--color-fm-secondary-800)"
												showSpinner={false}
											/>
											<PlayerProvider>
												<Player />
												{children}
											</PlayerProvider>
											<Toaster />
										</AdaptationProvider>
										<ReactQueryDevtools buttonPosition="top-left" />
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
