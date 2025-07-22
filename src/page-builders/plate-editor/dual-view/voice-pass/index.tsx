import React, { useMemo } from 'react'
import { useAIChatbotQueryHook } from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import Block from '@/page-builders/plate-editor/dual-view/voice-pass/block'
import CopyAll from '@/page-builders/plate-editor/dual-view/voice-pass/copy-all'
import { useEditorState } from '@udecode/plate-common/react'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { minify } from '@/lib/utils/ai-chatbot'
import { pretifyVoiceXMLData } from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import { EChatMode } from '@/types/ai-types'

export default function VoicePass({
	voiceMode,
}: {
	voiceMode: EChatMode.VOICE | EChatMode.VOICE2 | EChatMode.VOICE2_XML
}) {
	const { data: episodeContent } = useEpisodeContent()
	const { initialStoryData } = useEpisodeTableContext()

	const { responses } = useSocketStreaming()

	const episodesCount = useMemo(() => {
		return initialStoryData?.episode_count || 0
	}, [initialStoryData])

	const { children } = useEditorState()

	const { data } = useAIChatbotQueryHook({
		episodeNumber: episodeContent?.chapter.seq_number || 0,
		episodesCount,
		aiChatbotData: {
			messages: [],
			user_message: voiceMode,
			chat_mode: voiceMode,
			ep_text: getText(children),
			ep_text_json: minify(children),
			context: episodeContent?.chapter?.props?.llm_memories?.context || '',
		},
	})

	const streamedData = useMemo(() => {
		if (!data || !responses[data]) {
			return []
		}

		let concatenatedResponse = responses[data].join('')
		if (voiceMode === EChatMode.VOICE2_XML) {
			concatenatedResponse = pretifyVoiceXMLData(concatenatedResponse)
		}

		return concatenatedResponse.split('\n')
	}, [data, responses, voiceMode])

	if (!streamedData.length) {
		return <DualViewLoader />
	}

	return (
		<div className="grid *:[grid-area:1/-1]">
			<CopyAll id={data} streamedData={streamedData} />
			<div className="flex flex-col p-6">
				{streamedData.map((data, idx) => (
					<Block key={idx} data={data} />
				))}
			</div>
		</div>
	)
}
