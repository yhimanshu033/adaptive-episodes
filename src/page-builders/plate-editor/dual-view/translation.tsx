import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'

import ContentDisplay from './content-display'

export default function Translation() {
	const { data, isPending } = useEpisodeContent()

	return (
		<ContentDisplay content={data?.translation_text} isLoading={isPending} />
	)
}
