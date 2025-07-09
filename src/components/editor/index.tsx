'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeNavigation from '@/page-builders/plate-editor/episode-navigation'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

const PlateEditor = dynamic(() => import('./plate-editor'), {
	ssr: false,
	loading: () => <EditorSkeletonLoader />,
})

export function Editor() {
	const { episodeId } = useParams()

	return (
		<main className="flex flex-1 flex-col">
			<div className="max-auto container flex px-6">
				<EpisodeNavigation />
				<div className="relative w-full">
					<EpisodeIdProvider
						key={String(episodeId)}
						episodeId={Number(episodeId)}
					>
						<PlateEditor />
					</EpisodeIdProvider>
				</div>
			</div>
		</main>
	)
}
