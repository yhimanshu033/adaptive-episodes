/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import * as React from 'react'
import { TextIndicatorIcon } from '@/icons/text-indicator-icon'
import { LineHeightPlugin } from '@platejs/basic-styles/react'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

import { ToolbarButton } from './toolbar'

export function LineHeightToolbarButton(props: DropdownMenuProps) {
	const editor = useEditorRef()
	const { defaultNodeValue, validNodeValues: values = [] } =
		editor.getInjectProps(LineHeightPlugin)

	const value = useSelectionFragmentProp({
		defaultValue: defaultNodeValue,
		getProp: (node) => node.lineHeight,
	})

	const [open, setOpen] = React.useState(false)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={open} tooltip="Line height" isDropdown>
					<TextIndicatorIcon />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-50" align="start">
				<DropdownMenuRadioGroup
					value={value}
					className="flex flex-col gap-0.5"
					onValueChange={(newValue) => {
						editor
							.getTransforms(LineHeightPlugin)
							.lineHeight.setNodes(Number(newValue))
						editor.tf.focus()
					}}
				>
					{values.map((value) => (
						<DropdownMenuRadioItem
							key={value}
							className="min-w-24 py-2 [font-size:var(--text-fm-md)]"
							value={value}
						>
							{value}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
