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
	side,
	delayDuration = 700,
}: {
	children: React.ReactNode
	delayDuration?: number
	side?: 'bottom' | 'top' | 'right' | 'left'
	tooltip: React.ReactNode
}) {
	return (
		<TooltipProvider delayDuration={delayDuration}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
