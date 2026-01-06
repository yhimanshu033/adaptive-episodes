import React from 'react'
import { ArrowCornerUpLeftIcon } from '@/icons/arrow-corner-up-left-icon'
import { ArrowCornerUpRightIcon } from '@/icons/arrow-corner-up-right-icon'
import { ArchiveRestore } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import useBeatSheetEditor from '@/providers/beat-sheet-provider'

export default function UndoRedoButtons() {
	const { handleRedo, canRedo, canUndo, handleUndo, handleReset } =
		useBeatSheetEditor()

	return (
		<div className="flex items-center justify-between gap-4">
			<IconButton
				tooltip="Reset"
				disabled={!canUndo}
				onClick={handleReset}
				size="small"
				label="Reset"
				icon={<ArchiveRestore />}
			/>
			<div className="flex items-center justify-end gap-4">
				<IconButton
					tooltip="Undo"
					disabled={!canUndo}
					onClick={handleUndo}
					size="small"
					label="Undo"
					icon={<ArrowCornerUpLeftIcon />}
				/>
				<IconButton
					tooltip="Redo"
					disabled={!canRedo}
					onClick={handleRedo}
					size="small"
					label="Redo"
					icon={<ArrowCornerUpRightIcon />}
				/>
			</div>
		</div>
	)
}
