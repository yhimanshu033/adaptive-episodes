'use client'

import React from 'react'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import PreviewContent from './preview'

const Preview = ({ episodeId }: { episodeId: number }) => {
	return (
		<EpisodeIdProvider episodeId={episodeId}>
			<PreviewContent />
		</EpisodeIdProvider>
	)
}

export default Preview
