'use client'

import React from 'react'
import { EditorExtendedStateProvider } from '@/hooks/use-editor-extend-state'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import PreviewContent from './preview'

const Preview = ({ episodeId }: { episodeId: number }) => {
	return (
		<EditorExtendedStateProvider episodeId={episodeId}>
			<EpisodeIdProvider episodeId={episodeId}>
				<PreviewContent />
			</EpisodeIdProvider>
		</EditorExtendedStateProvider>
	)
}

export default Preview
