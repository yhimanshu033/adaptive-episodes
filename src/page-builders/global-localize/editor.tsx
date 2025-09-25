import React from 'react'
import { PlateController } from 'platejs/react'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import MultiEpLocalizePlateEditor from './plate-editor'

export default function Editor({ episodeId }: { episodeId: number }) {
	return (
		<main className="flex flex-1 flex-col">
			<EpisodeIdProvider key={String(episodeId)} episodeId={Number(episodeId)}>
				<PlateController>
					<MultiEpLocalizePlateEditor />
				</PlateController>
			</EpisodeIdProvider>
		</main>
	)
}
