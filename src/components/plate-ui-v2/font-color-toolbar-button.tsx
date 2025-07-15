/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { CapitalALetterIcon } from '@/icons/capital-a-letter-icon'
import { TickIcon } from '@/icons/tick-icon'
import type {
	DropdownMenuItemProps,
	DropdownMenuProps,
} from '@radix-ui/react-dropdown-menu'
import { useComposedRef } from '@udecode/cn'
import { cva } from 'class-variance-authority'
import debounce from 'lodash/debounce.js'
import { PlusIcon } from 'lucide-react'
import { KEYS } from 'platejs'
import { useEditorRef, useEditorSelector } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/aural-ui/tooltip'
import { cn } from '@/lib/utils/helpers'

import { Button } from '../aural-ui/button'
import { Divider } from '../aural-ui/divider'
import {
	DEFAULT_COLORS,
	DEFAULT_CUSTOM_COLORS,
} from '../plate-ui/color-constants'
import { ToolbarButton, ToolbarMenuGroup } from './toolbar'

const itemVariants = cva(
	'p-1 rounded-fm-m hover:border-fm-primary transition-all duration-200 border [&_svg:not([class*="text-"])]:!text-inherit relative overflow-hidden',
	{
		variants: {
			nodeType: {
				[KEYS.color]: 'border-fm-divider-primary',
				[KEYS.backgroundColor]: 'border-transparent',
			},
		},
	}
)

export function FontColorToolbarButton({
	children,
	nodeType,
	tooltip,
}: {
	nodeType: string
	tooltip?: string
} & DropdownMenuProps) {
	const editor = useEditorRef()

	const selectionDefined = useEditorSelector((editor) => !!editor.selection, [])

	const color = useEditorSelector(
		(editor) => editor.api.mark(nodeType) as string,
		[nodeType]
	)

	const [selectedColor, setSelectedColor] = React.useState<string>()
	const [open, setOpen] = React.useState(false)

	const onToggle = React.useCallback(
		(value = !open) => {
			setOpen(value)
		},
		[open, setOpen]
	)

	const updateColor = React.useCallback(
		(value: string) => {
			if (editor.selection) {
				setSelectedColor(value)

				editor.tf.select(editor.selection)
				editor.tf.focus()

				editor.tf.addMarks({ [nodeType]: value })
			}
		},
		[editor, nodeType]
	)

	const updateColorAndClose = React.useCallback(
		(value: string) => {
			updateColor(value)
			onToggle()
		},
		[onToggle, updateColor]
	)

	const clearColor = React.useCallback(() => {
		if (editor.selection) {
			editor.tf.select(editor.selection)
			editor.tf.focus()

			if (selectedColor) {
				editor.tf.removeMarks(nodeType)
			}

			onToggle()
		}
	}, [editor, selectedColor, onToggle, nodeType])

	React.useEffect(() => {
		if (selectionDefined) {
			setSelectedColor(color)
		}
	}, [color, selectionDefined])

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(value) => {
				setOpen(value)
			}}
			modal={false}
		>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={open} tooltip={tooltip}>
					{children}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="min-w-50">
				<ColorPicker
					color={selectedColor || color}
					clearColor={clearColor}
					colors={DEFAULT_COLORS}
					customColors={DEFAULT_CUSTOM_COLORS}
					updateColorAction={updateColorAndClose}
					updateCustomColor={updateColor}
					nodeType={nodeType}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function PureColorPicker({
	className,
	clearColor,
	color,
	colors,
	customColors,
	updateColorAction,
	updateCustomColor,
	nodeType,
	...props
}: React.ComponentProps<'div'> & {
	clearColor: () => void
	color?: string
	colors: TColor[]
	customColors: TColor[]
	nodeType?: string
	updateColorAction: (color: string) => void
	updateCustomColor: (color: string) => void
}) {
	return (
		<div className={cn('flex flex-col items-start p-4', className)} {...props}>
			<ToolbarMenuGroup label="Custom Colors">
				<ColorCustom
					color={color}
					colors={colors}
					customColors={customColors}
					updateColor={updateColorAction}
					updateCustomColor={updateCustomColor}
					nodeType={nodeType}
				/>
			</ToolbarMenuGroup>
			<Divider
				className="bg-fm-divider-primary"
				wrapperClassName="w-full my-4"
			/>
			<ToolbarMenuGroup label="Default Colors">
				<ColorDropdownMenuItems
					color={color}
					colors={colors}
					updateColorAction={updateColorAction}
					nodeType={nodeType}
				/>
			</ToolbarMenuGroup>
			<Divider
				className="bg-fm-divider-primary not-disabled:hover:bg-fm-surface-frosted/20"
				wrapperClassName="w-full my-4"
			/>
			<Button
				variant="text"
				size="sm"
				innerClassName="translate-y-0 bg-transparent transition-all rounded-md border-0 not-group-disabled:[color:var(--color-fm-primary)] not-group-disabled:hover:bg-fm-surface-frosted/20"
				onClick={() => clearColor()}
				disabled={!color}
				isDisabled={!color}
			>
				Clear
			</Button>
		</div>
	)
}

const ColorPicker = React.memo(
	PureColorPicker,
	(prev, next) =>
		prev.color === next.color &&
		prev.colors === next.colors &&
		prev.customColors === next.customColors
)

function ColorCustom({
	className,
	color,
	colors,
	customColors,
	updateColor,
	updateCustomColor,
	nodeType,
	...props
}: {
	color?: string
	colors: TColor[]
	customColors: TColor[]
	nodeType?: string
	updateColor: (color: string) => void
	updateCustomColor: (color: string) => void
} & React.ComponentPropsWithoutRef<'div'>) {
	const [customColor, setCustomColor] = React.useState<string>()
	const [value, setValue] = React.useState<string>(color || '#000000')

	React.useEffect(() => {
		if (
			!color ||
			customColors.some((c) => c.value === color) ||
			colors.some((c) => c.value === color)
		) {
			return
		}

		setCustomColor(color)
	}, [color, colors, customColors])

	const computedColors = React.useMemo(
		() =>
			customColor
				? [
						...customColors,
						{
							isBrightColor: false,
							name: '',
							value: customColor,
						},
					]
				: customColors,
		[customColor, customColors]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const updateCustomColorDebounced = React.useCallback(
		debounce(updateCustomColor, 100),
		[updateCustomColor]
	)

	return (
		<div className={cn('relative flex flex-col gap-4', className)} {...props}>
			<ColorDropdownMenuItems
				color={color}
				colors={computedColors}
				updateColorAction={updateColor}
				nodeType={nodeType}
			>
				<ColorInput
					value={value}
					onChange={(e) => {
						setValue(e.target.value)
						updateCustomColorDebounced(e.target.value)
					}}
				>
					<DropdownMenuItem
						className={cn(
							itemVariants({
								nodeType: nodeType as any,
							})
						)}
						onSelect={(e) => {
							e.preventDefault()
						}}
					>
						<span className="sr-only">Custom</span>
						<PlusIcon />
					</DropdownMenuItem>
				</ColorInput>
			</ColorDropdownMenuItems>
		</div>
	)
}

function ColorInput({
	children,
	className,
	value = '#000000',
	ref,
	...props
}: React.ComponentProps<'input'> & { ref?: React.Ref<HTMLInputElement> }) {
	const inputRef = React.useRef<HTMLInputElement | null>(null)

	return (
		<div className="flex flex-col items-center">
			{React.Children.map(children, (child) => {
				if (!child) {
					return child
				}

				return React.cloneElement(
					child as React.ReactElement<{
						onClick: () => void
					}>,
					{
						onClick: () => inputRef.current?.click(),
					}
				)
			})}
			<input
				{...props}
				ref={useComposedRef(ref, inputRef)}
				className={cn('size-0 overflow-hidden border-0 p-0', className)}
				value={value}
				type="color"
			/>
		</div>
	)
}

type TColor = {
	isBrightColor: boolean
	name: string
	value: string
}

function ColorDropdownMenuItem({
	className,
	isSelected,
	name,
	updateColor,
	value,
	nodeType,
	...props
}: {
	isBrightColor: boolean
	isSelected: boolean
	name?: string
	nodeType?: string
	updateColor: (color: string) => void
	value: string
} & DropdownMenuItemProps) {
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
					nodeType === KEYS.backgroundColor ? value : 'transparent',
				color: nodeType === KEYS.color ? value : 'var(--color-fm-primary)',
				borderColor: isSelected ? 'var(--color-fm-primary)' : undefined,
			}}
			onSelect={(e) => {
				e.stopPropagation()
				e.preventDefault()
				updateColor(value)
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
			<TooltipContent className="capitalize">{name}</TooltipContent>
		</Tooltip>
	) : (
		content
	)
}

export function ColorDropdownMenuItems({
	className,
	color,
	colors,
	updateColorAction,
	nodeType,
	...props
}: {
	color?: string
	colors: TColor[]
	nodeType?: string
	updateColorAction: (color: string) => void
} & React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('grid grid-cols-[repeat(10,1fr)] gap-2', className)}
			{...props}
		>
			<TooltipProvider>
				{colors.map(({ isBrightColor, name, value }) => (
					<ColorDropdownMenuItem
						name={name}
						key={name ?? value}
						value={value}
						isBrightColor={isBrightColor}
						isSelected={color === value}
						updateColor={updateColorAction}
						nodeType={nodeType}
					/>
				))}
				{props.children}
			</TooltipProvider>
		</div>
	)
}
