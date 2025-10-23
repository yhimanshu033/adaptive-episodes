/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useEffect } from 'react'
import useSaving from '@/hooks/use-saving'
// import { useEditorReadOnly } from 'platejs/react'
import { useEditorReadOnly, useUnifiedEditorState, useUnifiedEditorStore } from 'unified-editor'

const useSaveEpisode = () => {
	const { children } = useUnifiedEditorState()
	const readOnly = useEditorReadOnly()
	const { setCurrentDiffValue } = useUnifiedEditorStore()

	const { handleSave, isSaved, isPending, lastSaved } = useSaving()

	useEffect(() => {
		setCurrentDiffValue(structuredClone(children))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children])

	return {
		handleSave,
		isSaved,
		readOnly,
		isPending,
		lastSaved,
	}
}

export default useSaveEpisode
