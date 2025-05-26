/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import type { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import { cn } from '@udecode/cn'
import { Ban } from 'lucide-react'

import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/plate-ui/button'
import type { TColor } from '@/components/plate-ui/color-dropdown-menu'
import { DropdownMenuItem } from '@/components/plate-ui/dropdown-menu'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/plate-ui/tooltip'

type ColorDropdownMenuItemProps = {
	isBrightColor: boolean
	isSelected: boolean
	name?: string
	updateColor: (color: string) => void
	value: string
} & DropdownMenuItemProps

export function ColorDropdownMenuItem({
	className,
	isBrightColor,
	isSelected,
	name,
	updateColor,
	value,
	...props
}: ColorDropdownMenuItemProps) {
	const content = (
		<DropdownMenuItem
			className={cn(
				buttonVariants({
					isMenu: true,
					variant: 'outline-solid',
				}),
				'border-muted size-6 border border-solid p-0',
				!isBrightColor && 'border-transparent text-white',
				className
			)}
			style={{ backgroundColor: value }}
			onSelect={(e) => {
				e.preventDefault()
				updateColor(value)
			}}
			{...props}
		>
			{isSelected ? <Icons.check /> : null}
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
	updateColor: (color: string) => void
} & React.HTMLAttributes<HTMLDivElement>

export function ColorDropdownMenuItems({
	className,
	color,
	colors,
	clearColor,
	updateColor,
	...props
}: ColorDropdownMenuItemsProps & { clearColor?: () => void }) {
	function onSelect(e: Event) {
		e.preventDefault()
		clearColor?.()
	}
	const noneItem = (
		<DropdownMenuItem
			className={cn(
				buttonVariants({
					isMenu: true,
					variant: 'outline-solid',
				}),
				'border-muted size-6 border border-solid p-0',
				className
			)}
			style={{ backgroundColor: 'transparent' }}
			onSelect={onSelect as any}
			{...props}
		>
			<Ban />
		</DropdownMenuItem>
	)

	return (
		<div
			className={cn('grid grid-cols-[repeat(10,1fr)] gap-1', className)}
			{...props}
		>
			<Tooltip>
				<TooltipTrigger>{noneItem}</TooltipTrigger>
				<TooltipContent>None</TooltipContent>
			</Tooltip>
			{colors.map(({ isBrightColor, name, value }) => (
				<ColorDropdownMenuItem
					name={name}
					key={name ?? value}
					value={value}
					isBrightColor={isBrightColor}
					isSelected={color === value}
					updateColor={updateColor}
				/>
			))}
		</div>
	)
}
