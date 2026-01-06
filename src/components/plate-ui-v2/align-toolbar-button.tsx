'use client'

import * as React from 'react'
import type { Alignment } from '@platejs/basic-styles'
import { TextAlignPlugin } from '@platejs/basic-styles/react'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorPlugin, useSelectionFragmentProp } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

import { Icons, iconVariants } from '../icons'
import { ToolbarButton } from './toolbar'

const items = [
	{
		icon: Icons.alignLeft,
		value: 'left',
	},
	{
		icon: Icons.alignCenter,
		value: 'center',
	},
	{
		icon: Icons.alignRight,
		value: 'right',
	},
	{
		icon: Icons.alignJustify,
		value: 'justify',
	},
]

export function AlignToolbarButton(props: DropdownMenuProps) {
	const { editor, tf } = useEditorPlugin(TextAlignPlugin)
	const value =
		useSelectionFragmentProp({
			defaultValue: 'start',
			getProp: (node) => node.align,
		}) ?? 'left'

	const [open, setOpen] = React.useState(false)
	const IconValue =
		items.find((item) => item.value === value)?.icon ?? Icons.alignLeft

	return (
		<DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={open} tooltip="Align" isDropdown>
					<IconValue />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-40" align="end">
				<DropdownMenuRadioGroup
					value={value}
					className="flex flex-row items-center justify-between gap-1"
					onValueChange={(value) => {
						tf.textAlign.setNodes(value as Alignment)
						editor.tf.focus()
					}}
				>
					{items.map(({ icon: Icon, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="p-2 [font-size:var(--text-fm-md)]"
							classes={{
								indicator: 'hidden',
							}}
							value={itemValue}
						>
							<Icon className={iconVariants({ variant: 'toolbar' })} />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
