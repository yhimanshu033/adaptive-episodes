'use client'

import React from 'react'
import { useGlobalStore } from '@/store/global-store'

import Footer from '@/components/footer'
import Header from '@/components/header'
import { FullScreenLoader } from '@/components/loader'

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
	const isFullScreenLoading = useGlobalStore(
		(state) => state.isFullScreenLoading
	)
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			{isFullScreenLoading && <FullScreenLoader />}
			{children}
			<Footer />
		</div>
	)
}

export default ProjectsLayout
