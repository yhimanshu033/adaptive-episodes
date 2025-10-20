import React from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import {
	LASER_LEAF_KEYS,
	LASER_PROMPT_KEYS,
	rephraseMethods,
} from '@/constants/editor-constants'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import useLaserStore from '@/store/laser-store'
import { nanoid } from 'nanoid'
import { Value } from 'platejs'
import { useEditorRef } from 'platejs/react'
import type { Range } from 'slate'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { track } from '@/lib/utils/analytics'
import { mergeBlocks } from '@/lib/utils/plate'

import { MarkToolbarButton } from './mark-toolbar-button'

export default function FloatingLaserBtns() {
	const editor = useEditorRef()
	const { setActiveLaser, setPromptActive } = useLaserStore()
	const { suggestionGuard } = useSuggestionGuard()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<MarkToolbarButton
					nodeType={LaserPlugin.key as string}
					tooltip="Laser (⌘+B)"
					size="floating"
					manual
					onMouseDown={() => {}}
					onClick={() => {}}
				>
					<SparklesSoftIcon className="text-fm-secondary-800" />
				</MarkToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="min-w-50">
				{rephraseMethods.map((method, idx) => (
					<div key={method.id}>
						<DropdownMenuItem
							className="cursor-pointer [font-size:var(--text-fm-md)]"
							onClick={() => {
								const children = structuredClone(editor.children)
								let newChildren: Value = children
								const id = nanoid()
								if (method.id === 'custom') {
									const key = `${LASER_PROMPT_KEYS.ID_START}${id}`
									newChildren = mergeBlocks(
										children,
										editor.selection as Range,
										[PromptPlugin.key as string, key] as string[]
									)
									document.getElementById(LASER_PROMPT_KEYS.INPUT)?.focus()
									setTimeout(() => {
										setPromptActive(key)
									}, 500)
									// setPromptActive(key)
								} else {
									const key = `${LASER_LEAF_KEYS.ID_START}${id}`
									newChildren = mergeBlocks(
										children,
										editor.selection as Range,
										[
											`${LASER_LEAF_KEYS.METHOD_START}${String(method.id)}`,
											LaserPlugin.key as string,
											key,
										] as string[]
									)
									setTimeout(() => {
										setActiveLaser(key)
									}, 500)
								}
								suggestionGuard(() => {
									editor.tf.setValue(newChildren)
								})
								track({
									event: EVENT_TYPE.BUTTON_CLICK,
									screenName: SCREEN_NAME.EPISODE_EDITOR,
									metaData: {
										action: ACTION.LASER_START,
										method: method.id,
										flowId: id,
									},
								})
							}}
						>
							{method.method}
						</DropdownMenuItem>
						{idx < rephraseMethods.length - 1 && (
							<DropdownMenuSeparator className="my-0" />
						)}
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
