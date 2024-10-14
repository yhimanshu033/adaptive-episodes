import React from 'react'
import usePlateStore, { setScale } from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { collapseSelection } from '@udecode/plate-common'
import { focusEditor, useEditorRef } from '@udecode/plate-common/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	useOpenState,
} from './dropdown-menu'
import { ToolbarButton } from './toolbar'

const items = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function ZoomDropdownMenu(props: DropdownMenuProps) {
	const scale = usePlateStore((state) => state.scale)
	const editor = useEditorRef()
	const openState = useOpenState()

	const defaultItem = 1
	const selectedItem = items.find((item) => item === scale) || defaultItem
	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					className="lg:min-w-[60px]"
					pressed={openState.open}
					tooltip="Zoom"
					isDropdown
				>
					<span>{`${selectedItem * 100}%`}</span>
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-0" align="start">
				<DropdownMenuLabel>Zoom</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					value={String(selectedItem)}
					onValueChange={(type) => {
						setScale(Number(type))
						collapseSelection(editor)
						focusEditor(editor)
					}}
				>
					<DropdownMenuRadioItem className="min-w-[180px]" value={'1.0'}>
						Fit
					</DropdownMenuRadioItem>
					{items.map((val, idx) => (
						<DropdownMenuRadioItem
							key={`scale-item-${idx}`}
							className="min-w-[180px]"
							value={String(val)}
						>
							{`${val * 100}%`}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
