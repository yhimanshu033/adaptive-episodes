/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useEffect } from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import useSaving from '@/hooks/use-saving'
import usePlateStore from '@/store/plate-store'
import { useEditorReadOnly } from 'platejs/react'

const useSaveEpisode = () => {
	const { children } = useEditorData()
	const readOnly = useEditorReadOnly()
	const { setCurrentDiffValue } = usePlateStore()

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
