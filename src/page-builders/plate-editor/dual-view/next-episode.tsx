import React from 'react'
import { NEXT_EP_EDITOR_ID } from '@/constants/editor-constants'
import useNextEpisodeContent from '@/hooks/query/use-next-episode-content'

import ContentDisplay from './content-display'

export default function NextEpisode() {
	const { data, isPending } = useNextEpisodeContent()

	return (
		<ContentDisplay
			content={data?.text}
			id={NEXT_EP_EDITOR_ID}
			isLoading={isPending}
		/>
	)
}
