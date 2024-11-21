'use client'

import React, { useEffect } from 'react'
import { SocketProvider } from '@/hooks/use-socket'
import { updateUserData } from '@/store/global-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

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
						<ReactQueryDevtools />
					</ThemeProvider>
				</QueryClientProvider>
			</SocketProvider>
		</SessionProvider>
	)
}

export default AppProvider
