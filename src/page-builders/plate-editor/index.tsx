'use client'

import React from 'react'
import EditorChild from '@/page-builders/plate-editor/split-editor/editor-child'
import useEditorExtendedStore from '@/store/extended-store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useShallow } from 'zustand/react/shallow'

import { EpisodeTableProvider } from '@/providers/episode-table-provider'

import EditorHeader from './editor-header'

const EpisodePlateEditor = () => {
	const { store: extendStore } = useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))
	const episodeMap = extendStore(useShallow((state) => state.episodeMap))

	return (
		<EpisodeTableProvider>
			<main className="flex flex-1 flex-col">
				<DndProvider backend={HTML5Backend}>
					<EditorHeader
						initialSeqNumber={episodeMap[extended[0]]?.chapter?.seq_number}
					/>
					<div className="relative">
						{extended.map((episodeId) => (
							<EditorChild key={episodeId} episodeId={episodeId} />
						))}
					</div>
				</DndProvider>
			</main>
		</EpisodeTableProvider>
	)
}

export default EpisodePlateEditor
