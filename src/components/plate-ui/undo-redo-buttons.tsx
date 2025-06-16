import React from 'react'
import { ArrowCornerUpLeftIcon } from '@/icons/arrow-corner-up-left-icon'
import { ArrowCornerUpRightIcon } from '@/icons/arrow-corner-up-right-icon'
import { useEditorRef } from '@udecode/plate-common/react'

import { ToolbarButton } from '@/components/plate-ui/toolbar'

export default function UndoRedoButtons() {
	const editor = useEditorRef()
	const undo = () => {
		editor.undo()
	}
	const redo = () => {
		editor.redo()
	}
	return (
		<>
			<ToolbarButton tooltip="Undo (⌘+Z)" onClick={undo}>
				<ArrowCornerUpLeftIcon />
			</ToolbarButton>
			<ToolbarButton tooltip="Redo (⌘+⇧+Z)" onClick={redo}>
				<ArrowCornerUpRightIcon />
			</ToolbarButton>
		</>
	)
}
