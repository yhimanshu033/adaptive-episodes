import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useAIChatbotQueryHook } from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useStoriesData } from '@/hooks/query/use-story-data'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'

import { VOICE_PASS_MODE } from '@/types/ai-types'

export default function VoicePass() {
	const { id } = useParams()
	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()

	const { responses } = useSocketStreaming()

	const episodesCount = useMemo(() => {
		return stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	}, [stories, id])

	const { data } = useAIChatbotQueryHook({
		episodeNumber: episodeContent?.chapter.seq_number || 0,
		episodesCount,
		aiChatbotData: {
			messages: [],
			user_message: VOICE_PASS_MODE,
			chat_mode: VOICE_PASS_MODE,
		},
	})

	const streamedData = useMemo(() => {
		if (!data || !responses[data]) return ''

		return responses[data].join('')
	}, [data, responses])

	if (!streamedData) {
		return <DualViewLoader />
	}

	return (
		<div>
			<p>{streamedData}</p>
		</div>
	)
}
