'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeNavigation from '@/page-builders/plate-editor/episode-navigation'
import { useEditorStore } from '@/store/editor-store'
import { PlateController } from 'platejs/react'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'
import { cn } from '@/lib/aural-ui/utils'

const PlateEditor = dynamic(() => import('./plate-editor'), {
	ssr: false,
	loading: () => <EditorSkeletonLoader />,
})

export function Editor() {
	const { episodeId } = useParams()
	const isEpisodeNavigationOpen = useEditorStore(
		(state) => state.isEpisodeNavigationOpen
	)

	return (
		<main className="flex flex-1 flex-col">
			<div
				className={cn('flex transition-all', {
					'pl-6': !isEpisodeNavigationOpen,
				})}
			>
				<EpisodeNavigation />
				<div className="relative w-full">
					<EpisodeIdProvider
						key={String(episodeId)}
						episodeId={Number(episodeId)}
					>
						<PlateController>
							<PlateEditor />
						</PlateController>
					</EpisodeIdProvider>
				</div>
			</div>
		</main>
	)
}
