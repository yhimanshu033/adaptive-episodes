/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useEffect } from 'react'
import useSaving from '@/hooks/use-saving'
import usePlateStore from '@/store/plate-store'
import { useEditorReadOnly, useEditorState } from '@udecode/plate-common/react'

const useSaveEpisode = () => {
	const { children } = useEditorState()
	const readOnly = useEditorReadOnly()
	const { setCurrentDiffValue } = usePlateStore()

	const { handleSave, isSaved, isPending, lastSaved } = useSaving()

	useEffect(() => {
		setCurrentDiffValue(structuredClone(children))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children])

	useEffect(() => {
		const intervalId = setInterval(handleSave, 2000)
		return () => clearInterval(intervalId)
	}, [handleSave])

	return {
		handleSave,
		isSaved,
		readOnly,
		isPending,
		lastSaved,
	}
}

export default useSaveEpisode
