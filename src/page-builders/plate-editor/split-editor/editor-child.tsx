import React from 'react'
import PlateEditor from '@/page-builders/plate-editor/editor'
import ControlButtons from '@/page-builders/plate-editor/split-editor/control-buttons'

import { Separator } from '@/components/ui/separator'
import { EpisodeIdProvider } from '@/providers/episode-id-provider'

export default function EditorChild({
	episodeId,
	isLast,
}: {
	episodeId: number
	isLast: boolean
}) {
	return (
		<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
			<PlateEditor />
			{isLast ? <ControlButtons /> : <Separator />}
		</EpisodeIdProvider>
	)
}
