'use client'

import React, { useEffect } from 'react'
import { colorOptions, USER_SELECTED_COLOR } from '@/constants/global-constants'
import usePageChange from '@/hooks/query/use-page-change'
import { SocketProvider } from '@/hooks/use-socket'
import { SocketStreamingProvider } from '@/hooks/use-socket-streaming'
import { SocketUtilContextProvider } from '@/hooks/use-socket-util'
import Player from '@/page-builders/plate-editor/player'
import { updateUserData } from '@/store/global-store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Toaster } from '@/components/aural-ui/toast'
import { TooltipProvider } from '@/components/plate-ui-v2/tooltip'
import { PopupRoot } from '@/components/popup-root'
import ExternalScripts from '@/components/scripts/external-scripts'
import { AdaptationProvider } from '@/providers/adaptation-provider'
import { ConfigurationContextProvider } from '@/providers/configuration-provider'
import { PlayerProvider } from '@/providers/player-provider'
import { PollingProvider } from '@/providers/polling-provider'
import { SessionProviderSync } from '@/providers/session-sync-provider'
import { queryClient } from '@/lib/get-query-client'
import { handleWindowLocation, LOCAL_STORAGE_KEYS } from '@/lib/utils/analytics'

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
		if (typeof localStorage !== 'undefined') {
			// SSR Guard
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.UID,
				String(session?.user?.id || 'na')
			)
		}
	}, [session])

	useEffect(() => {
		handleWindowLocation()
	}, [])

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

	usePageChange()

	return (
		<SessionProvider session={session} refetchOnWindowFocus={false}>
			<SessionProviderSync session={session}>
				<NuqsAdapter>
					<DndProvider backend={HTML5Backend}>
						<SocketUtilContextProvider>
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
														<ConfigurationContextProvider>
															<NextTopLoader
																color="var(--color-fm-secondary-800)"
																showSpinner={false}
															/>
															<PlayerProvider>
																<Player />
																{children}
															</PlayerProvider>
														</ConfigurationContextProvider>
														<Toaster />
														<PopupRoot />
													</AdaptationProvider>
													<ReactQueryDevtools />
												</TooltipProvider>
											</ThemeProvider>
										</QueryClientProvider>
									</PollingProvider>
								</SocketStreamingProvider>
							</SocketProvider>
						</SocketUtilContextProvider>
					</DndProvider>
				</NuqsAdapter>
				<ExternalScripts />
			</SessionProviderSync>
		</SessionProvider>
	)
}

export default AppProvider
