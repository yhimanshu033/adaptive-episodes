'use client'

import React from 'react'

import Sidebar from './sidebar'
import Stories from './stories'

const Projects = () => {
	return (
		<main className="container relative flex-1 animate-fade-in-up flex-col py-2">
			<h1 className="mb-2 text-center text-2xl font-bold"> Stories</h1>
			<p className="mb-6 text-center text-muted-foreground">
				Explore various stories and their versions across different countries.
			</p>
			<Stories />
			<Sidebar />
		</main>
	)
}

export default Projects
