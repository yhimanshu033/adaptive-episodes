/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from 'react'
import useCustomPlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import {
	focusEditor,
	useEditorPlugin,
	useEditorReadOnly,
	useEditorRef,
	usePlateStore,
} from '@udecode/plate-common/react'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import { Icons } from '@/components/icons'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	useOpenState,
} from './dropdown-menu'
import { ToolbarButton } from './toolbar'

export function ModeDropdownMenu(props: DropdownMenuProps) {
	const editorRef = useEditorRef()
	const setReadOnly = usePlateStore().set.readOnly()
	const readOnly = useEditorReadOnly()
	const openState = useOpenState()
	const { setOption, getOption } = useEditorPlugin(SuggestionPlugin)

	const sidebar = useCustomPlateStore((state) => state.sidebar)

	useEffect(() => {
		if (sidebar === 'far') {
			setReadOnly(true)
		}
		if (!sidebar) {
			setReadOnly(false)
		}
	}, [sidebar, setReadOnly])

	const value = readOnly
		? 'viewing'
		: getOption('isSuggesting')
			? 'suggesting'
			: 'editing'

	const item: any = {
		editing: (
			<>
				<Icons.editing className="mr-2 size-5" />
				<span className="hidden lg:inline">Editing</span>
			</>
		),
		viewing: (
			<>
				<Icons.viewing className="mr-2 size-5" />
				<span className="hidden lg:inline">Viewing</span>
			</>
		),
		suggesting: (
			<>
				<Icons.suggesting className="mr-2 size-5" />
				<span className="hidden lg:inline">Suggesting</span>
			</>
		),
	}

	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					className="min-w-[auto] lg:min-w-[130px]"
					pressed={openState.open}
					tooltip="Editing mode"
					isDropdown
				>
					{item[value]}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-[180px]" align="start">
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					value={value}
					onValueChange={(newValue) => {
						setReadOnly(newValue === 'viewing')
						setOption('isSuggesting', newValue === 'suggesting')

						if (newValue === 'editing') {
							focusEditor(editorRef)
						}
					}}
				>
					<DropdownMenuRadioItem disabled={sidebar === 'far'} value="editing">
						{item.editing}
					</DropdownMenuRadioItem>

					<DropdownMenuRadioItem
						disabled={sidebar === 'far'}
						value="suggesting"
					>
						{item.suggesting}
					</DropdownMenuRadioItem>

					<DropdownMenuRadioItem value="viewing">
						{item.viewing}
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
