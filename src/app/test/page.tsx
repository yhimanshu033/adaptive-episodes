'use client'

import React from 'react'

import PlateEditor from '@/components/plate-editor'
import { TooltipProvider } from '@/components/plate-ui/tooltip'

export default function Page() {
	return (
		<TooltipProvider
			disableHoverableContent
			delayDuration={500}
			skipDelayDuration={0}
		>
			<PlateEditor />
		</TooltipProvider>
	)
}
