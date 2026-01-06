'use client'

import * as React from 'react'
import { ArrowCornerUpLeftIcon } from '@/icons/arrow-corner-up-left-icon'
import { ArrowCornerUpRightIcon } from '@/icons/arrow-corner-up-right-icon'
import { useEditorRef, useEditorSelector } from 'platejs/react'

import { ToolbarButton } from './toolbar'

export function RedoToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const editor = useEditorRef()
	const disabled = useEditorSelector(
		(editor) => editor.history.redos.length === 0,
		[]
	)

	return (
		<ToolbarButton
			{...props}
			disabled={disabled}
			onClick={() => editor.redo()}
			onMouseDown={(e) => e.preventDefault()}
			tooltip="Redo (⌘+⇧+Z)"
		>
			<ArrowCornerUpRightIcon className="text-fm-primary" />
		</ToolbarButton>
	)
}

export function UndoToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const editor = useEditorRef()
	const disabled = useEditorSelector(
		(editor) => editor.history.undos.length === 0,
		[]
	)

	return (
		<ToolbarButton
			{...props}
			disabled={disabled}
			onClick={() => editor.undo()}
			onMouseDown={(e) => e.preventDefault()}
			tooltip="Undo (⌘+Z)"
		>
			<ArrowCornerUpLeftIcon className="text-fm-primary" />
		</ToolbarButton>
	)
}
