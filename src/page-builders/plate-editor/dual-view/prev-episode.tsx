import React from 'react'
import { PREV_EP_EDITOR_ID } from '@/constants/editor-constants'
import usePreviousEpisodeContent from '@/hooks/query/use-prev-episode-content'

import ContentDisplay from './content-display'

export default function PreviousEpisode() {
	const { data, isPending } = usePreviousEpisodeContent()

	return (
		<ContentDisplay
			content={data?.text}
			id={PREV_EP_EDITOR_ID}
			isLoading={isPending}
		/>
	)
}
