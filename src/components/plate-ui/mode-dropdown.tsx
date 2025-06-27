/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { EditorModes, editorModesList } from '@/constants/editor-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useCustomPlateStore from '@/store/plate-store'
import { SelectProps } from '@radix-ui/react-select'
import {
	focusEditor,
	useEditorPlugin,
	useEditorReadOnly,
	useEditorRef,
	usePlateStore,
} from '@udecode/plate-common/react'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
} from '@/components/aural-ui/select'
import { Typography } from '@/components/aural-ui/typography'
import useProjectId from '@/providers/project-id-provider'
import { toPascalCase } from '@/lib/utils/helpers'

export function ModeDropdown(props: SelectProps) {
	const editorRef = useEditorRef()
	const setReadOnly = usePlateStore().set.readOnly()
	const readOnly = useEditorReadOnly()
	const { setOption, useOption } = useEditorPlugin(SuggestionPlugin)
	const isSuggesting = useOption('isSuggesting')

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
		: isSuggesting
			? EditorModes.suggesting
			: EditorModes.editing

	const handleChange = useCallback(
		(newValue: string) => {
			if (!isWriter || !!simplifiedEditor) {
				return
			}
			setReadOnly(newValue === String(EditorModes.viewing))
			setOption('isSuggesting', newValue === String(EditorModes.suggesting))

			if (newValue === String(EditorModes.editing)) {
				focusEditor(editorRef)
			}
		},
		[isWriter, simplifiedEditor, setReadOnly, setOption, editorRef]
	)

	return (
		<Select value={value} onValueChange={handleChange} {...props}>
			<SelectTrigger
				decoration="outline"
				classes={{
					root: 'border-fm-divider-secondary font-fm-brand h-auto rounded-full',
					icon: 'size-4',
				}}
			>
				{toPascalCase(value)}
			</SelectTrigger>

			<SelectContent
				align="end"
				classes={{
					root: 'min-w-50',
					scrollButton: {
						icon: 'size-4',
					},
				}}
			>
				{editorModesList.map(
					({ mode, label, description, icon: Icon }, idx) => (
						<div key={idx}>
							<SelectItem
								disabled={mode !== EditorModes.viewing ? viewMode : false}
								value={mode}
								classes={{
									root: 'py-8 cursor-pointer',
									icon: 'size-4',
								}}
							>
								<div className="flex items-center gap-3">
									<Icon className="h-5 w-5" />
									<div>
										<Typography
											as="h1"
											variant="body-medium"
											className="text-fm-md"
											color="primary"
										>
											{label}
										</Typography>
										<Typography
											as="p"
											variant="body-small"
											className="text-fm-sm"
											color="secondary"
										>
											{description}
										</Typography>
									</div>
								</div>
							</SelectItem>
							{idx < editorModesList.length - 1 && <SelectSeparator />}
						</div>
					)
				)}
			</SelectContent>
		</Select>
	)
}
