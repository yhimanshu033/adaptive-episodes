'use client'

import React from 'react'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import { If } from '@/components/aural-ui/if-else'
import Header from '@/components/header'
import { FullScreenLoader } from '@/components/loader'

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const isFullScreenLoading = useGlobalStore(
		useShallow((state) => state.isFullScreenLoading)
	)
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<If condition={isFullScreenLoading}>
				<FullScreenLoader />
			</If>
			{children}
		</div>
	)
}
