'use client'

import React, { useEffect } from 'react'
import { SocketProvider } from '@/hooks/use-socket'
import { updateUserData } from '@/store/global-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const AppProvider = ({
	session,
	children,
}: {
	children: React.ReactNode
	session: Session | null
}) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnMount: false,
				refetchOnWindowFocus: false,
			},
		},
	})

	useEffect(() => {
		updateUserData(session)
	}, [session])

	return (
		<SessionProvider session={session}>
			<NuqsAdapter>
				<SocketProvider>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem
							disableTransitionOnChange
						>
							<NextTopLoader />
							{children}
						</ThemeProvider>
					</QueryClientProvider>
				</SocketProvider>
			</NuqsAdapter>
		</SessionProvider>
	)
}

export default AppProvider
