import React from 'react'
import Episodes from '@/page-builders/episodes'

import { EpisodeTableProvider } from '@/providers/episode-table-provider'

export default function Page() {
	return (
		<EpisodeTableProvider>
			<Episodes />
		</EpisodeTableProvider>
	)
}
