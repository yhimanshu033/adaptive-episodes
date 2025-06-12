import React from 'react'
import type { Metadata } from 'next'

import '@/styles/globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

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
	const locale = await getLocale()
	return (
		<html lang={locale} suppressHydrationWarning className="scroll-smooth">
			<body suppressHydrationWarning className={`font-body antialiased`}>
				<NextIntlClientProvider>
					<AppProvider session={session}>{children}</AppProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
