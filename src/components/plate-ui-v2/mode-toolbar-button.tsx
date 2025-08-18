'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { EditorModes, editorModesList } from '@/constants/editor-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useRecentUser from '@/hooks/use-recent-user'
import useCustomPlateStore, { usePlateStore } from '@/store/plate-store'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import {
	useEditorPlugin,
	useEditorRef,
	usePlateState,
	usePluginOption,
} from 'platejs/react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
} from '@/components/aural-ui/select'
import useProjectId from '@/providers/project-id-provider'
import { cn, toPascalCase } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

import { Typography } from '../aural-ui/typography'

export function ModeToolbarButton(props: DropdownMenuProps) {
	const [readOnly, setReadOnly] = usePlateState('readOnly')
	const { setSidebar } = usePlateStore()

	const editorRef = useEditorRef()

	const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting')
	const { setOption } = useEditorPlugin(SuggestionPlugin)

	const { isWriter } = useProjectId()
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const { store } = useCustomPlateStore()
	const viewMode = store((state) => state.viewMode)
	const filteredModesList = editorModesList.filter(
		({ mode }) => isWriter || mode === EditorModes.viewing
	)

	const { canCurrentUserBeRecent } = useRecentUser()

	const value = readOnly
		? EditorModes.viewing
		: isSuggesting
			? EditorModes.suggesting
			: EditorModes.editing

	const handleChange = React.useCallback(
		(newValue: string) => {
			if (!isWriter || !!simplifiedEditor || !canCurrentUserBeRecent) {
				return
			}
			setReadOnly(newValue === String(EditorModes.viewing))
			setOption('isSuggesting', newValue === String(EditorModes.suggesting))

			if (newValue === String(EditorModes.suggesting)) {
				setSidebar(ESidebar.COMMENTS)
			}

			if (newValue === String(EditorModes.editing)) {
				editorRef.tf.focus({ edge: 'end' })
			}
		},
		[
			isWriter,
			simplifiedEditor,
			setReadOnly,
			setOption,
			editorRef.tf,
			setSidebar,
			canCurrentUserBeRecent,
		]
	)

	useEffect(() => {
		if (!isWriter || simplifiedEditor || !canCurrentUserBeRecent) {
			setTimeout(() => {
				setReadOnly(true)
			}, 0)
			return
		}
		setReadOnly(viewMode)
	}, [
		isWriter,
		setReadOnly,
		simplifiedEditor,
		viewMode,
		canCurrentUserBeRecent,
	])

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
								disabled={mode !== EditorModes.viewing ? viewMode : false}
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
