import React from 'react'
import useEditorExtendedStore from '@/store/extended-store'
import { useShallow } from 'zustand/react/shallow'

import Editor from './editor'

export default function EditorArray() {
	const { store: extendedStore } = useEditorExtendedStore()
	const extended = extendedStore(useShallow((state) => state.extended))

	return (
		<div>
			{extended.map((episodeId) => {
				return <Editor episodeId={episodeId} key={episodeId} />
			})}
		</div>
	)
}
