'use client'

import React from 'react'
import Stories from '@/page-builders/admin/internationalization/stories'

import BackButton from '@/components/back-button'

const Projects = () => {
	return (
		<main className="animate-fade-in-up container relative flex-1 flex-col py-6">
			<div className="flex items-center gap-6">
				<BackButton />
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold">Internationalization</h1>
				</div>
			</div>
			<Stories />
		</main>
	)
}

export default Projects
