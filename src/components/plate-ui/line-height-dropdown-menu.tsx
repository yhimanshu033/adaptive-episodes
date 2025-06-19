/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { TextIndicatorIcon } from '@/icons/text-indicator-icon'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import {
	useLineHeightDropdownMenu,
	useLineHeightDropdownMenuState,
} from '@udecode/plate-line-height/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

export function LineHeightDropdownMenu({ ...props }: DropdownMenuProps) {
	const openState = useOpenState()
	const state = useLineHeightDropdownMenuState()
	const { radioGroupProps } = useLineHeightDropdownMenu(state)

	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					pressed={openState.open}
					tooltip="Line height"
					isDropdown
				>
					<TextIndicatorIcon />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-50" align="start">
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					{...radioGroupProps}
				>
					{state.values.map((_value) => (
						<DropdownMenuRadioItem
							key={_value}
							className="min-w-24 py-2 [font-size:var(--text-fm-md)]"
							value={_value}
						>
							{_value}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
