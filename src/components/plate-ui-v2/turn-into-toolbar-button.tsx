'use client'

import * as React from 'react'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import type { TElement } from 'platejs'
import { KEYS } from 'platejs'
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { getBlockType, setBlockType } from '@/components/editor/transforms'

import { Icons } from '../icons'
import { ToolbarButton, ToolbarMenuGroup } from './toolbar'

export const turnIntoItems = [
	{
		icon: Icons.paragraph,
		keywords: ['paragraph'],
		label: 'Text',
		value: KEYS.p,
	},
	{
		icon: Icons.h1,
		keywords: ['title', 'h1'],
		label: 'Heading 1',
		value: 'h1',
	},
	{
		icon: Icons.h2,
		keywords: ['subtitle', 'h2'],
		label: 'Heading 2',
		value: 'h2',
	},
	{
		icon: Icons.h3,
		keywords: ['subtitle', 'h3'],
		label: 'Heading 3',
		value: 'h3',
	},
	{
		icon: Icons.h4,
		keywords: ['subtitle', 'h4'],
		label: 'Heading 4',
		value: 'h4',
	},
	{
		icon: Icons.h5,
		keywords: ['subtitle', 'h5'],
		label: 'Heading 5',
		value: 'h5',
	},
	{
		icon: Icons.h6,
		keywords: ['subtitle', 'h6'],
		label: 'Heading 6',
		value: 'h6',
	},
	{
		icon: Icons.blockquote,
		keywords: ['citation', 'blockquote', '>'],
		label: 'Quote',
		value: KEYS.blockquote,
	},
]

export function TurnIntoToolbarButton(props: DropdownMenuProps) {
	const editor = useEditorRef()
	const [open, setOpen] = React.useState(false)

	const value = useSelectionFragmentProp({
		defaultValue: KEYS.p,
		getProp: (node) => getBlockType(node as TElement),
	})
	const selectedItem = React.useMemo(
		() =>
			turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ??
			turnIntoItems[0],
		[value]
	)

	const { icon: SelectedItemIcon } = selectedItem

	return (
		<DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={open} tooltip="Turn into" isDropdown>
					<SelectedItemIcon className="size-5 lg:hidden" />
					<span className="max-lg:hidden">
						<SelectedItemIcon />
					</span>
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="ignore-click-outside/toolbar min-w-50"
				align="start"
				onCloseAutoFocus={(e) => {
					e.preventDefault()
					editor.tf.focus()
				}}
			>
				<ToolbarMenuGroup
					className="flex flex-col gap-0.5"
					value={value}
					onValueChange={(type) => {
						setBlockType(editor, type)
					}}
				>
					{turnIntoItems.map(({ icon: Icon, label, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="min-w-[180px] py-2 [font-size:var(--text-fm-md)]"
							value={itemValue}
						>
							<Icon className="mr-2 size-4" />
							{label}
						</DropdownMenuRadioItem>
					))}
				</ToolbarMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
