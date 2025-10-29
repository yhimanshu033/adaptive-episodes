'use client'

import * as React from 'react'
import { toUnitLess } from '@platejs/basic-styles'
import { FontSizePlugin } from '@platejs/basic-styles/react'
import { Minus, Plus } from 'lucide-react'
import type { TElement } from 'platejs'
import { KEYS } from 'platejs'
import { useEditorPlugin, useEditorSelector } from 'platejs/react'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'
import { cn } from '@/lib/utils/helpers'

import { List, ListItem } from '../aural-ui/list'
import { ToolbarButton } from './toolbar'

const DEFAULT_FONT_SIZE = '16'

const FONT_SIZE_MAP = {
	h1: '36',
	h2: '24',
	h3: '20',
} as const

const FONT_SIZES = [
	'8',
	'9',
	'10',
	'12',
	'14',
	'16',
	'18',
	'24',
	'30',
	'36',
	'48',
	'60',
	'72',
	'96',
] as const

export function FontSizeToolbarButton() {
	const [inputValue, setInputValue] = React.useState(DEFAULT_FONT_SIZE)
	const [isFocused, setIsFocused] = React.useState(false)
	const { editor, tf } = useEditorPlugin(FontSizePlugin)

	const cursorFontSize = useEditorSelector((editor) => {
		const fontSize = editor.api.marks()?.[KEYS.fontSize]

		if (fontSize) {
			return toUnitLess(fontSize as string)
		}

		const [block] = editor.api.block<TElement>() || []

		if (!block?.type) {
			return DEFAULT_FONT_SIZE
		}

		return block.type in FONT_SIZE_MAP
			? FONT_SIZE_MAP[block.type as keyof typeof FONT_SIZE_MAP]
			: DEFAULT_FONT_SIZE
	}, [])

	const handleInputChange = () => {
		const newSize = toUnitLess(inputValue)

		if (Number.parseInt(newSize) < 1 || Number.parseInt(newSize) > 100) {
			editor.tf.focus()

			return
		}
		if (newSize !== toUnitLess(cursorFontSize)) {
			tf.fontSize.addMark(`calc(${newSize}px*var(--editor-scale,1))`)
		}

		editor.tf.focus()
	}

	const handleFontSizeChange = (delta: number) => {
		const newSize = Number(displayValue) + delta
		tf.fontSize.addMark(`calc(${newSize}px*var(--editor-scale,1))`)
		editor.tf.focus()
	}

	const displayValue = isFocused ? inputValue : cursorFontSize

	return (
		<div className="flex h-7 items-center gap-1 rounded-md p-0">
			<ToolbarButton onClick={() => handleFontSizeChange(-1)}>
				<Minus />
			</ToolbarButton>

			<Popover open={isFocused} modal={false}>
				<PopoverTrigger asChild>
					<input
						className={cn(
							'hover:bg-fm-secondary-50 h-full w-10 shrink-0 bg-transparent px-1 text-center text-sm'
						)}
						value={displayValue}
						onBlur={(e) => {
							// Check if the blur is caused by clicking inside the popover
							const relatedTarget = e.relatedTarget as HTMLElement
							const popoverContent = e.currentTarget.closest(
								'[data-radix-popper-content-wrapper]'
							)

							// If clicking inside popover, don't close it
							if (relatedTarget && popoverContent?.contains(relatedTarget)) {
								return
							}

							setIsFocused(false)
							handleInputChange()
						}}
						onChange={(e) => setInputValue(e.target.value)}
						onFocus={() => {
							setIsFocused(true)
							setInputValue(toUnitLess(cursorFontSize))
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleInputChange()
							}
						}}
						data-plate-focus="true"
						type="text"
					/>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="w-16 backdrop-blur-xs"
					onOpenAutoFocus={(e) => e.preventDefault()}
					onMouseDown={(e) => {
						// Prevent blur when clicking inside popover
						e.preventDefault()
					}}
				>
					<List className="bg-transparent">
						{FONT_SIZES.map((size) => (
							<ListItem
								key={size}
								selected={size === displayValue}
								onClick={() => {
									tf.fontSize.addMark(`calc(${size}px*var(--editor-scale,1))`)
									setInputValue(size)
									setIsFocused(false)
									editor.tf.focus()
								}}
								data-highlighted={size === displayValue}
								className="py-2"
							>
								{size}
							</ListItem>
						))}
					</List>
				</PopoverContent>
			</Popover>

			<ToolbarButton onClick={() => handleFontSizeChange(1)}>
				<Plus />
			</ToolbarButton>
		</div>
	)
}
