import React from 'react'
import type { Metadata } from 'next'

import { fontSans } from '@/lib/fonts'

import '@/styles/globals.css'

import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
	title: 'Co-Writer',
	description: 'Co-Writer',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${fontSans.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
