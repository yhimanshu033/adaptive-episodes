'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
	const queryClient = new QueryClient()
	return (
		<SessionProvider session={session}>
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
		</SessionProvider>
	)
}

export default AppProvider
