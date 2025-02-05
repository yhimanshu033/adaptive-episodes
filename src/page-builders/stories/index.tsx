'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const Stories = dynamic(() => import('@/page-builders/stories/stories'))

const StoryDashboard = () => {
	return (
		<main className="flex flex-1 animate-fade-in-up">
			<Stories />
		</main>
	)
}

export default StoryDashboard
