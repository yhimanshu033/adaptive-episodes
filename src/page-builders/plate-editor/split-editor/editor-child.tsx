import React from 'react'
import PlateEditor from '@/page-builders/plate-editor/plate-editor'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

export const EditorChild = React.memo(
	({ episodeId }: { episodeId: number }) => {
		return (
			<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
				<PlateEditor />
			</EpisodeIdProvider>
		)
	}
)

EditorChild.displayName = 'EditorChild'

export default EditorChild
