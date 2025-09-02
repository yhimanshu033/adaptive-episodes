import React from 'react'
import { PlusIcon } from '@/icons/plus-icon'

import { Button } from '@/components/aural-ui/button'
import { TableCell, TableRow } from '@/components/aural-ui/table'
import { cn } from '@/lib/aural-ui/utils'

export interface InventEpisodeButtonProps {
	handleInventMouseEnter?: React.DOMAttributes<
		HTMLTableRowElement | HTMLButtonElement
	>['onMouseEnter']
	handleInventMouseLeave?: React.DOMAttributes<
		HTMLTableRowElement | HTMLButtonElement
	>['onMouseLeave']
	onClick?: () => void
	shouldShowHoverAction?: boolean
	show?: boolean
}

export default function InventEpisodeButton({
	handleInventMouseLeave,
	handleInventMouseEnter,
	onClick,
	show,
	shouldShowHoverAction,
}: InventEpisodeButtonProps) {
	if (!show) {
		return null
	}

	return (
		<TableRow
			className={cn(
				'relative border-none p-0 opacity-0 transition-opacity duration-300',
				{
					'opacity-100': shouldShowHoverAction,
				}
			)}
			onMouseLeave={handleInventMouseLeave}
		>
			<TableCell className="absolute -bottom-4 -left-5 p-0">
				<Button
					variant="secondary"
					size="sm"
					className="border-fm-divider-secondary w-10 rounded-full border"
					innerClassName="border border-fm-divider-secondary"
					noise="low"
					onClick={onClick}
					onMouseEnter={handleInventMouseEnter}
					onMouseLeave={handleInventMouseLeave}
					tooltip={shouldShowHoverAction && 'Invent Episode'}
				>
					<PlusIcon width={16} height={16} className="flex shrink-0" />
				</Button>
			</TableCell>
		</TableRow>
	)
}
