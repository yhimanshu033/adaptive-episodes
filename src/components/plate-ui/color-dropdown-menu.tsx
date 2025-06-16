'use client'

import React from 'react'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorRef, useEditorState } from '@udecode/plate-common/react'
import {
	useColorDropdownMenu,
	useColorDropdownMenuState,
} from '@udecode/plate-font/react'

import {
	DEFAULT_COLORS,
	DEFAULT_CUSTOM_COLORS,
} from '@/components/plate-ui/color-constants'
import { ColorPicker } from '@/components/plate-ui/color-picker'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import { nodeOperation } from '@/lib/utils/plate'

export type TColor = {
	isBrightColor: boolean
	name: string
	value: string
}

type ColorDropdownMenuProps = {
	buttonProps?: React.ComponentProps<typeof ToolbarButton>
	nodeType: string
	tooltip?: string
} & DropdownMenuProps

export function ColorDropdownMenu({
	children,
	nodeType,
	tooltip,
	buttonProps,
}: ColorDropdownMenuProps) {
	const state = useColorDropdownMenuState({
		closeOnSelect: true,
		colors: DEFAULT_COLORS,
		customColors: DEFAULT_CUSTOM_COLORS,
		nodeType,
	})
	const editor = useEditorRef()
	const { children: value } = useEditorState()

	const clearColor = React.useCallback(() => {
		if (editor.selection) {
			const newChildren = nodeOperation(value, editor.selection, (node) => {
				delete node[nodeType]
			})
			editor.tf.setValue(newChildren)
		}
	}, [editor, nodeType, value])

	const { buttonProps: stateButtonProps, menuProps } =
		useColorDropdownMenu(state)

	return (
		<DropdownMenu modal={false} {...menuProps}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton tooltip={tooltip} {...stateButtonProps} {...buttonProps}>
					{children}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<ColorPicker
					color={state.selectedColor || state.color}
					clearColor={clearColor}
					colors={state.colors}
					customColors={state.customColors}
					updateColor={state.updateColorAndClose}
					updateCustomColor={state.updateColor}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
