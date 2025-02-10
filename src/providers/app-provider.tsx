'use client'

import React, { useEffect } from 'react'
import { PRIMARY_BACKGROUND_COLOR } from '@/constants/global-constants'
import { SocketProvider } from '@/hooks/use-socket'
import { SocketStreamingProvider } from '@/hooks/use-socket-streaming'
import { updateUserData } from '@/store/global-store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { TooltipProvider } from '@/components/plate-ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { queryClient } from '@/lib/get-query-client'

import { SessionData } from '@/types/admin-types'

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

	return (
		<SessionProvider session={session}>
			<NuqsAdapter>
				<SocketProvider>
					<SocketStreamingProvider>
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
									<NextTopLoader color={PRIMARY_BACKGROUND_COLOR} />
									{children}
									<Toaster />
									<ReactQueryDevtools />
								</TooltipProvider>
							</ThemeProvider>
						</QueryClientProvider>
					</SocketStreamingProvider>
				</SocketProvider>
			</NuqsAdapter>
		</SessionProvider>
	)
}

export default AppProvider
