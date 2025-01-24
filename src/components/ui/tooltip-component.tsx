import React from 'react'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

export function TooltipComponent({
	children,
	tooltip,
	delayDuration = 700,
}: {
	children: React.ReactNode
	delayDuration?: number
	tooltip: React.ReactNode
}) {
	return (
		<TooltipProvider delayDuration={delayDuration}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
