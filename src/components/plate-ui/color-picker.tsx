/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'

import type { TColor } from '@/components/plate-ui/color-dropdown-menu'
import { ColorDropdownMenuItems } from '@/components/plate-ui/color-dropdown-menu-items'

import { Button } from '../aural-ui/button'
import { Divider } from '../aural-ui/divider'

export const ColorPickerContent = withRef<
	'div',
	{
		clearColor: () => void
		color?: string
		colors: TColor[]
		customColors: TColor[]
		nodeType?: string
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
			nodeType,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn('flex flex-col items-start gap-4 p-4', className)}
				{...props}
			>
				<ColorDropdownMenuItems
					color={color}
					colors={colors}
					updateColorAction={updateColor}
					nodeType={nodeType}
				/>
				<Divider className="bg-fm-divider-primary" wrapperClassName="w-full" />
				<Button
					variant="text"
					size="sm"
					innerClassName="translate-y-0 [color:var(--color-fm-primary)] hover:bg-fm-surface-frosted/20 transition-all rounded-md"
					onClick={() => clearColor()}
				>
					Clear
				</Button>
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
