'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { extendStore } from '@/hooks/use-editor-extend-state'
import EditorChild from '@/page-builders/plate-editor/split-editor/editor-child'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const EpisodePlateEditor = () => {
	const { extended, setExtended } = extendStore()
	const { episodeId } = useParams()

	useEffect(() => {
		setExtended([Number(episodeId)])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [episodeId])

	return (
		<main className="container flex flex-1 flex-col p-4">
			<DndProvider backend={HTML5Backend}>
				<div className="relative space-y-5">
					{extended.map((episodeId) => (
						<EditorChild key={episodeId} episodeId={episodeId} />
					))}
				</div>
			</DndProvider>
		</main>
	)
}

export default EpisodePlateEditor
