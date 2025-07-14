import React, { HTMLAttributes } from 'react'
import { DEFAULT_FONT_FAMILY, FONT_RECORD } from '@/constants/editor-constants'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

const items = Object.keys(FONT_RECORD).map((key) => ({
	description: key,
	icon: (props: HTMLAttributes<HTMLSpanElement>) => (
		<span
			{...props}
			style={{ ...props.style, fontFamily: `var(${FONT_RECORD[key]})` }}
		>
			{key}
		</span>
	),
	label: key,
	value: FONT_RECORD[key],
}))

const defaultItem = items.find((item) => item.value === DEFAULT_FONT_FAMILY)!

export function FontDropdownMenu(props: DropdownMenuProps) {
	const { store: usePlateStoreContext, setFontFamily } = usePlateStore()
	const fontFamily = usePlateStoreContext(
		useShallow((state) => state.fontFamily)
	)

	const selectedItem =
		items.find((item) => item.value === fontFamily) ?? defaultItem
	const { icon: SelectedItemIcon } = selectedItem

	return (
		<DropdownMenu modal={false} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton tooltip="Font Family" isDropdown>
					<SelectedItemIcon className="size-5 lg:hidden" />
					<span className="max-lg:hidden">
						<SelectedItemIcon />
					</span>
					<ChevronDown className="ml-2" />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-50" align="start">
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					value={fontFamily}
					onValueChange={(type) => {
						setFontFamily(type)
					}}
				>
					{items.map(({ icon: Icon, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="min-w-45 py-2 [font-size:var(--text-fm-md)]"
							value={itemValue}
						>
							<Icon className="mr-2 w-full" />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
