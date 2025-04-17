'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import GlobalLocalize from '@/page-builders/plate-editor/sidebar-sections/global-localize'
import EditorChild from '@/page-builders/plate-editor/split-editor/editor-child'
import useEditorExtendedStore from '@/store/extended-store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useShallow } from 'zustand/react/shallow'

import { If } from '@/components/if-else'
import ProjectHeader from '@/components/project-header'

const EpisodePlateEditor = () => {
	const { store: extendStore } = useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))
	const episodeMap = extendStore(useShallow((state) => state.episodeMap))
	const searchParams = useSearchParams()
	const localize = searchParams.get('localize')

	return (
		<main className="flex flex-1 flex-col">
			<DndProvider backend={HTML5Backend}>
				<ProjectHeader
					initialSeqNumber={episodeMap[extended[0]]?.chapter?.seq_number}
				/>
				<div className="flex">
					<div className="relative">
						{extended.map((episodeId) => (
							<EditorChild key={episodeId} episodeId={episodeId} />
						))}
					</div>
					<If condition={!!localize}>
						<GlobalLocalize />
					</If>
				</div>
			</DndProvider>
		</main>
	)
}

export default EpisodePlateEditor
