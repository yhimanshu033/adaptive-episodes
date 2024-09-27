import React from 'react'
import type { Metadata } from 'next'

import { fontSans } from '@/lib/fonts'

import '@/styles/globals.css'

import AppProvider from '@/providers/app-provider'
import getServerSession from '@/lib/get-access-token'

export const metadata: Metadata = {
	title: 'Co-Writer',
	description: 'Co-Writer',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getServerSession()
	return (
		<html lang="en">
			<body className={`${fontSans.className} antialiased`}>
				<AppProvider session={session}>{children}</AppProvider>
			</body>
		</html>
	)
}
