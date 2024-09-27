'use client'

import React from 'react'

import Stories from './stories'

const StoryDashboard = () => {
	return (
		<main className="flex-1 animate-fade-in-up">
			<div className="container py-4 text-center">
				<Stories />
			</div>
		</main>
	)
}

export default StoryDashboard
