'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import EpisodeNavigation from '@/page-builders/plate-editor/episode-navigation'
import UCE from '@/page-builders/plate-editor/uce'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

export function Editor() {
	const { episodeId } = useParams()
	return (
		<main className="flex flex-1 flex-col">
			<div className="flex transition-all">
				<EpisodeNavigation />
				<div className="relative w-full">
					<EpisodeIdProvider episodeId={Number(episodeId)}>
						<UCE />
					</EpisodeIdProvider>
				</div>
			</div>
		</main>
	)
}
