import React from 'react'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorRef } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

const items = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function ZoomDropdownMenu(props: DropdownMenuProps) {
	const { store, setScale } = usePlateStore()
	const scale = store((state) => state.scale)
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

			<DropdownMenuContent className="min-w-50" align="start">
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					value={String(selectedItem)}
					onValueChange={(type) => {
						setScale(Number(type))
						editor.tf.collapse()
						editor.tf.focus({ edge: 'end' })
					}}
				>
					<DropdownMenuRadioItem
						className="min-w-24 py-2 [font-size:var(--text-fm-md)]"
						value={'1.0'}
					>
						Fit
					</DropdownMenuRadioItem>
					{items.map((val, idx) => (
						<DropdownMenuRadioItem
							key={`scale-item-${idx}`}
							className="min-w-24 py-2 [font-size:var(--text-fm-md)]"
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
