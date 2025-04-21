/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { EditorModes } from '@/constants/editor-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
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
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import useProjectId from '@/providers/project-id-provider'

export function ModeDropdownMenu(props: DropdownMenuProps) {
	const editorRef = useEditorRef()
	const setReadOnly = usePlateStore().set.readOnly()
	const readOnly = useEditorReadOnly()
	const openState = useOpenState()
	const { setOption, getOption } = useEditorPlugin(SuggestionPlugin)

	const { isWriter } = useProjectId()
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const { store } = useCustomPlateStore()
	const viewMode = store((state) => state.viewMode)

	useEffect(() => {
		if (simplifiedEditor) {
			setReadOnly(true)
			return
		}
		if (!isWriter) {
			setReadOnly(true)
			return
		}
		setReadOnly(viewMode)
	}, [viewMode, setReadOnly, isWriter, simplifiedEditor])

	const value = readOnly
		? EditorModes.viewing
		: getOption('isSuggesting')
			? EditorModes.suggesting
			: EditorModes.editing

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
					disabled={!isWriter}
				>
					{item[value]}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-[180px]" align="start">
				<DropdownMenuRadioGroup
					className="flex flex-col gap-0.5"
					value={value}
					onValueChange={(newValue) => {
						if (!isWriter || !!simplifiedEditor) return
						setReadOnly(newValue === EditorModes.viewing)
						setOption('isSuggesting', newValue === EditorModes.suggesting)

						if (newValue === EditorModes.editing) {
							focusEditor(editorRef)
						}
					}}
				>
					<DropdownMenuRadioItem
						disabled={viewMode}
						value={EditorModes.editing}
					>
						{item.editing}
					</DropdownMenuRadioItem>

					<DropdownMenuRadioItem
						disabled={viewMode}
						value={EditorModes.suggesting}
					>
						{item.suggesting}
					</DropdownMenuRadioItem>

					<DropdownMenuRadioItem value={EditorModes.viewing}>
						{item.viewing}
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
