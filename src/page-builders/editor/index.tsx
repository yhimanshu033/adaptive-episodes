'use client'

import React from 'react'

import PlateEditor from '@/components/plate-editor'
import { TooltipProvider } from '@/components/plate-ui/tooltip'

// import Editor from './editor'

const EpisodeEditor = () => {
	return (
		<main className="container flex flex-1 animate-fade-in-up flex-col p-4">
			<TooltipProvider
				disableHoverableContent
				delayDuration={500}
				skipDelayDuration={0}
			>
				<PlateEditor />
			</TooltipProvider>
			{/* <Editor /> */}
		</main>
	)
}

export default EpisodeEditor
