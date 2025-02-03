/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'

import type { TColor } from '@/components/plate-ui/color-dropdown-menu'
import { ColorDropdownMenuItems } from '@/components/plate-ui/color-dropdown-menu-items'

export const ColorPickerContent = withRef<
	'div',
	{
		clearColor: () => void
		color?: string
		colors: TColor[]
		customColors: TColor[]
		updateColor: (color: string) => void
		updateCustomColor: (color: string) => void
	}
>(
	(
		{
			className,
			clearColor,
			color,
			colors,
			updateColor,
			customColors,
			updateCustomColor,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn('flex flex-col gap-4 p-4', className)}
				{...props}
			>
				<ColorDropdownMenuItems
					color={color}
					colors={colors}
					updateColor={updateColor}
					clearColor={clearColor}
				/>
			</div>
		)
	}
)

export const ColorPicker = React.memo(
	ColorPickerContent,
	(prev, next) =>
		prev.color === next.color &&
		prev.colors === next.colors &&
		prev.customColors === next.customColors
)
