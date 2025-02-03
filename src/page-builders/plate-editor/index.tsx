'use client'

import React from 'react'
import EditorChild from '@/page-builders/plate-editor/split-editor/editor-child'
import useEditorExtendedStore from '@/store/extended-store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useShallow } from 'zustand/react/shallow'

const EpisodePlateEditor = () => {
	const { store: extendStore } = useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))

	return (
		<main className="flex flex-1 flex-col">
			<DndProvider backend={HTML5Backend}>
				<div className="relative">
					{extended.map((episodeId) => (
						<EditorChild key={episodeId} episodeId={episodeId} />
					))}
				</div>
			</DndProvider>
		</main>
	)
}

export default EpisodePlateEditor
