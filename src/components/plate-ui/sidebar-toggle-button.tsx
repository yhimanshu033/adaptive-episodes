'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { useUnifiedEditorStore } from 'unified-editor'

import { cn } from '@/lib/aural-ui/utils'

import { ESidebar } from '@/types/plate-types'

import { IconButton, type IconButtonProps } from '../aural-ui/icon-button'

interface SidebarToggleButtonProps extends IconButtonProps {
	sidebar: ESidebar
	// Tooltip props from IconButton
	tooltip?: React.ReactNode
	tooltipContentProps?: Omit<
		React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
		'children'
	>
	tooltipProps?: Omit<
		React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
		'children'
	>
}

export function SidebarToggleButton({
	sidebar,
	label,
	icon,
	tooltip,
	tooltipContentProps,
	tooltipProps,
	...props
}: SidebarToggleButtonProps) {
	const { store, setSidebar } = useUnifiedEditorStore()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === sidebar

	return (
		<IconButton
			variant="ghost"
			onClick={() => setSidebar(sidebar, true)}
			shape="square"
			className={cn(
				'hover:text-fm-secondary-800 hover:bg-fm-secondary-50 size-7 shrink-0',
				{
					'bg-fm-secondary-50 text-fm-secondary-800': isActive,
					'text-fm-icon-active': !isActive,
				}
			)}
			icon={icon}
			label={label}
			tooltip={tooltip}
			tooltipContentProps={tooltipContentProps}
			tooltipProps={tooltipProps}
			{...props}
		/>
	)
}
