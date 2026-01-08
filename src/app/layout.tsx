import React from 'react'
import type { Metadata } from 'next'

import '@/styles/globals.css'

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
			<body suppressHydrationWarning className={`font-body antialiased`}>
				{children}
			</body>
		</html>
	)
}
