import React from 'react'
import { useEditorRef } from '@udecode/plate-common/react'
import { RedoIcon, UndoIcon } from 'lucide-react'

import { ToolbarButton } from './toolbar'

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
				<UndoIcon />
			</ToolbarButton>
			<ToolbarButton tooltip="Redo (⌘+⇧+Z)" onClick={redo}>
				<RedoIcon />
			</ToolbarButton>
		</>
	)
}
