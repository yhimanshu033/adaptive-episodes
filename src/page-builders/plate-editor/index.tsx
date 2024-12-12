'use client'

import React from 'react'

import { TooltipProvider } from '@/components/plate-ui/tooltip'

import PlateEditor from './editor'

const EpisodePlateEditor = () => {
	return (
		<main className="container flex flex-1 animate-fade-in-up flex-col p-4">
			<TooltipProvider
				disableHoverableContent
				delayDuration={500}
				skipDelayDuration={0}
			>
				<PlateEditor />
			</TooltipProvider>
		</main>
	)
}

export default EpisodePlateEditor
