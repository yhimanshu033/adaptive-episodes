'use client'

import React, { useMemo } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { EditorModes, editorModesList } from '@/constants/editor-constants'
import useEditAccess from '@/hooks/use-edit-access'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import {
	ESidebar,
	useEditorPlugin,
	useEditorReadOnly,
	usePluginOption,
	useUnifiedEditorRef,
	useUnifiedEditorStore,
} from 'unified-editor'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
} from '@/components/aural-ui/select'
import { track } from '@/lib/utils/analytics'
import { cn, toPascalCase } from '@/lib/utils/helpers'

import { Typography } from '../aural-ui/typography'

export function ModeToolbarButton(props: DropdownMenuProps) {
	const { setSidebar, setViewMode } = useUnifiedEditorStore()
	const editorRef = useUnifiedEditorRef()
	const readOnly = useEditorReadOnly()

	const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting')
	const { setOption } = useEditorPlugin(SuggestionPlugin)

	const { cannotEdit } = useEditAccess()

	const filteredModesList = useMemo(() => {
		return editorModesList.filter(
			({ mode }) => !cannotEdit || mode === EditorModes.viewing
		)
	}, [cannotEdit])

	const value = useMemo(() => {
		if (cannotEdit || readOnly) {
			return EditorModes.viewing
		}
		if (isSuggesting) {
			return EditorModes.suggesting
		}
		return EditorModes.editing
	}, [cannotEdit, isSuggesting, readOnly])

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (cannotEdit) {
				setViewMode(true)
				return
			}
			setViewMode(newValue === String(EditorModes.viewing))
			setOption('isSuggesting', newValue === String(EditorModes.suggesting))

			if (newValue === String(EditorModes.suggesting)) {
				setSidebar(ESidebar.COMMENTS)
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.SUGGESTION_MODE,
					},
				})
			}

			if (newValue === String(EditorModes.editing)) {
				editorRef.tf.focus({ edge: 'end' })
			}
		},
		[cannotEdit, setViewMode, setOption, editorRef.tf, setSidebar]
	)

	return (
		<Select value={value} onValueChange={handleChange} {...props}>
			<SelectTrigger
				decoration="outline"
				classes={{
					root: cn(
						'border-fm-divider-secondary font-fm-brand h-auto rounded-full',
						{
							'border-fm-hotpink-200 bg-fm-hotpink-50 text-fm-secondary-800 focus:border-fm-hotpink-400 active:border-fm-hotpink-400 data-[state=open]:border-fm-hotpink-400':
								value !== EditorModes.editing,
						}
					),
					icon: cn('size-4', {
						'text-fm-secondary-800': value !== EditorModes.editing,
					}),
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
				{filteredModesList.map(
					({ mode, label, description, icon: Icon }, idx) => (
						<div key={idx}>
							<SelectItem
								disabled={mode !== value && cannotEdit}
								value={mode}
								classes={{
									root: 'py-8 cursor-pointer',
									icon: 'size-4',
								}}
							>
								<div className="flex items-center gap-3 pr-12">
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
							{idx < filteredModesList.length - 1 && <SelectSeparator />}
						</div>
					)
				)}
			</SelectContent>
		</Select>
	)
}
