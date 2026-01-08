import React from 'react'
import type { Metadata } from 'next'

import '@/styles/globals.css'

import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
	title: 'Adaptive Episodes',
	description:
		'Adaptive Episodes: An AI-powered writing assistant that helps you effortlessly craft and enhance your episodes, making the writing process seamless and inspiring.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html suppressHydrationWarning className="scroll-smooth">
			<body
				suppressHydrationWarning
				className={`font-body bg-fm-surface-primary antialiased`}
			>
				<ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
			</body>
		</html>
	)
}
