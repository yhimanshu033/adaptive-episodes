import React from 'react'
import useBeatSheetEnabled from '@/hooks/use-beatsheet-enabled'
import BeatSheetEditorContent from '@/page-builders/beatsheet-editor/bse-editor'

export default function BeatSheetEditor() {
	const isBSEEnabled = useBeatSheetEnabled()

	if (!isBSEEnabled) {
		return null
	}

	return <BeatSheetEditorContent />
}
