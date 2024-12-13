import React from 'react'
import type { Metadata } from 'next'

import { fontSans } from '@/lib/fonts'

import '@/styles/globals.css'

import AppProvider from '@/providers/app-provider'
import getServerSession from '@/lib/get-access-token'

export const metadata: Metadata = {
	title: 'Pocket CoPilot',
	description:
		'Pocket CoPilot: An AI-powered writing assistant that helps you effortlessly craft and enhance your stories, making the writing process seamless and inspiring.',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getServerSession()
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fontSans.className} antialiased`}>
				<AppProvider session={session}>{children}</AppProvider>
			</body>
		</html>
	)
}
