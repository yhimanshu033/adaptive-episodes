/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { CapitalALetterIcon } from '@/icons/capital-a-letter-icon'
import { TickIcon } from '@/icons/tick-icon'
import type { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import { cn } from '@udecode/cn'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'
import { cva } from 'class-variance-authority'

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/aural-ui/tooltip'
import type { TColor } from '@/components/plate-ui/color-dropdown-menu'
import { DropdownMenuItem } from '@/components/plate-ui/dropdown-menu'

type ColorDropdownMenuItemProps = {
	isBrightColor: boolean
	isSelected: boolean
	name?: string
	nodeType?: string
	updateColorAction: (color: string) => void
	value: string
} & DropdownMenuItemProps

const itemVariants = cva(
	'p-1 rounded-fm-m hover:border-fm-primary transition-all duration-200 border [&_svg:not([class*="text-"])]:!text-inherit relative overflow-hidden',
	{
		variants: {
			nodeType: {
				[FontColorPlugin.key]: 'border-fm-divider-primary',
				[FontBackgroundColorPlugin.key]: 'border-transparent',
			},
		},
	}
)

export function ColorDropdownMenuItem({
	className,
	isSelected,
	name,
	updateColorAction,
	value,
	nodeType,
	...props
}: ColorDropdownMenuItemProps) {
	const content = (
		<DropdownMenuItem
			className={cn(
				itemVariants({
					nodeType: nodeType as any,
				}),
				className
			)}
			style={{
				backgroundColor:
					nodeType === FontBackgroundColorPlugin.key ? value : 'transparent',
				color:
					nodeType === FontColorPlugin.key ? value : 'var(--color-fm-primary)',
				borderColor: isSelected ? 'var(--color-fm-primary)' : undefined,
			}}
			onSelect={(e) => {
				e.preventDefault()
				updateColorAction(value)
			}}
			{...props}
		>
			<CapitalALetterIcon />
			{isSelected ? (
				<span className="text-fm-positive absolute inset-0 flex items-center justify-center bg-black/50">
					<TickIcon />
				</span>
			) : null}
		</DropdownMenuItem>
	)

	return name ? (
		<Tooltip>
			<TooltipTrigger>{content}</TooltipTrigger>
			<TooltipContent>{name}</TooltipContent>
		</Tooltip>
	) : (
		content
	)
}

type ColorDropdownMenuItemsProps = {
	color?: string
	colors: TColor[]
	nodeType?: string
	updateColorAction: (color: string) => void
} & React.HTMLAttributes<HTMLDivElement>

export function ColorDropdownMenuItems({
	className,
	color,
	colors,
	updateColorAction,
	nodeType,
	...props
}: ColorDropdownMenuItemsProps & { clearColor?: () => void }) {
	return (
		<div
			className={cn('grid grid-cols-[repeat(10,1fr)] gap-2', className)}
			{...props}
		>
			{colors.map(({ isBrightColor, name, value }) => (
				<ColorDropdownMenuItem
					key={name ?? value}
					value={value}
					isBrightColor={isBrightColor}
					isSelected={color === value}
					updateColorAction={updateColorAction}
					nodeType={nodeType}
				/>
			))}
		</div>
	)
}
