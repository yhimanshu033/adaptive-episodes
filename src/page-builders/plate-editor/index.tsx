'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import EpisodeNavigation from '@/page-builders/plate-editor/episode-navigation'
import GlobalLocalize from '@/page-builders/plate-editor/sidebar-sections/global-localize'
import EditorChild from '@/page-builders/plate-editor/split-editor/editor-child'
import useEditorExtendedStore from '@/store/extended-store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useShallow } from 'zustand/react/shallow'

import { If } from '@/components/if-else'

const EpisodePlateEditor = () => {
	const { store: extendStore } = useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))
	const searchParams = useSearchParams()
	const globalLocalize = searchParams.get(GLOBAL_LOCALIZE)

	return (
		<main className="flex flex-1 flex-col">
			<DndProvider backend={HTML5Backend}>
				<div className="max-auto container flex px-0">
					<If condition={!globalLocalize}>
						<EpisodeNavigation />
					</If>

					<div className="relative w-full">
						{extended.map((episodeId) => (
							<EditorChild key={episodeId} episodeId={episodeId} />
						))}
					</div>
					<If condition={!!globalLocalize}>
						<GlobalLocalize />
					</If>
				</div>
			</DndProvider>
		</main>
	)
}

export default EpisodePlateEditor
