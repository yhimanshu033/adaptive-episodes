import React from 'react'
import UCE from '@/page-builders/plate-editor/uce'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

export default function Editor({ episodeId }: { episodeId: number }) {
	return (
		<main className="flex h-[calc(100dvh-116px)] flex-1 flex-col">
			<EpisodeIdProvider key={String(episodeId)} episodeId={Number(episodeId)}>
				<UCE />
			</EpisodeIdProvider>
		</main>
	)
}
