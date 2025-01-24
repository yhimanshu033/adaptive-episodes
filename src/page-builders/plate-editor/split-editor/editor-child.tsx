import React from 'react'
import PlateEditor from '@/page-builders/plate-editor/editor'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

export default function EditorChild({ episodeId }: { episodeId: number }) {
	return (
		<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
			<PlateEditor />
		</EpisodeIdProvider>
	)
}
