import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'

import ContentDisplay from './content-display'

export default function Translation() {
	const { data, isPending } = useEpisodeContent()

	return (
		<ContentDisplay
			contentUrl={data?.chapter.translation_url}
			isLoading={isPending}
		/>
	)
}
