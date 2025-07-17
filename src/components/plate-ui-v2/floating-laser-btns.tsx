import React from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
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
} from '@/components/plate-ui/dropdown-menu'
import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { mergeBlocks } from '@/lib/utils/plate'

import { MarkToolbarButton } from './mark-toolbar-button'

export default function FloatingLaserBtns() {
	const editor = useEditorRef()
	const { setActiveLaser, setPromptActive } = useLaserStore()
	const key = `laser-id-${nanoid()}`

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<MarkToolbarButton
					nodeType={(LaserPlugin as { key: string }).key}
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
								if (method.id === 'custom') {
									const key = `floating-prompt-id-${nanoid()}`
									newChildren = mergeBlocks(
										children,
										editor.selection as Range,
										[(PromptPlugin as { key: string }).key, key] as string[]
									)
									document.getElementById('prompt-input')?.focus()
									setPromptActive(key)
								} else {
									newChildren = mergeBlocks(
										children,
										editor.selection as Range,
										[
											`laser-method-${String(method.id)}`,
											String((LaserPlugin as { key: string }).key),
											key,
										] as string[]
									)
									setActiveLaser(key)
								}
								editor.tf.setValue(newChildren)
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
