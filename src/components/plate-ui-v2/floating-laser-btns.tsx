import React from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import useLaserStore from '@/store/laser-store'
// import { useEditorRef } from '@udecode/plate-common/react'
// import { Value } from '@udecode/slate'
import { nanoid } from 'nanoid'
import type { Range } from 'slate'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/plate-ui/dropdown-menu'
// import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { mergeBlocks } from '@/lib/utils/plate'

import { MarkToolbarButton } from './mark-toolbar-button'

export default function FloatingLaserBtns() {
	// const editor = useEditorRef()
	const { setActiveLaser, setPromptActive } = useLaserStore()
	const key = `laser-id-${nanoid()}`

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<MarkToolbarButton
					onClick={() => {}}
					// nodeType={LaserPlugin.key}
					nodeType="laser"
					tooltip="Laser (⌘+B)"
					size="floating"
				>
					<SparklesSoftIcon className="text-fm-secondary-800" />
				</MarkToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="min-w-50">
				{rephraseMethods.map((method, idx) => (
					<div key={method.id}>
						<DropdownMenuItem
							className="[font-size:var(--text-fm-md)]"
							// onClick={() => {
							// 	// const children = structuredClone(editor.children)
							// 	// let newChildren: Value = children
							// 	if (method.id === 'custom') {
							// 		const key = `floating-prompt-id-${nanoid()}`
							// 		newChildren = mergeBlocks(
							// 			children,
							// 			// editor.selection as Range,
							// 			[PromptPlugin.key, key]
							// 		)
							// 		document.getElementById('prompt-input')?.focus()
							// 		setPromptActive(key)
							// 	} else {
							// 		newChildren = mergeBlocks(
							// 			children,
							// 			editor.selection as Range,
							// 			[`laser-method-${method.id}`, LaserPlugin.key, key]
							// 		)
							// 		setActiveLaser(key)
							// 	}
							// 	editor.tf.setValue(newChildren)
							// }}
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
