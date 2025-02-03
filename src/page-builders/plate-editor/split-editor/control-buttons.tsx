import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaving from '@/hooks/use-saving'
import useEditorExtendedStore from '@/store/extended-store'
import { useQueryClient } from '@tanstack/react-query'
import {
	CircleArrowLeft,
	CircleArrowRight,
	SeparatorHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ControlButtons() {
	const router = useRouter()
	const { id } = useParams()
	const queryClient = useQueryClient()
	const { store: extendStore, setExtended } = useEditorExtendedStore()
	const { extended, episodeMap } = extendStore()

	const firstEpisode = episodeMap[extended[0]]
	const lastEpisode = episodeMap[extended[extended.length - 1]]
	const { data: content, queryKey } = useEpisodeContent()
	const { isSaved, handleSave } = useSaving()

	const handleEpisodeChange = async (episode: number | null) => {
		if (!episode) return
		await handleSave({ startOverlayLoading: true })
		router.push(`/projects/${String(id)}/${episode}/editor`)
	}

	const handleEpisodeSplit = async () => {
		if (!isSaved) {
			await handleSave({ startOverlayLoading: true, stopOverlayLoading: true })
			await queryClient.invalidateQueries({ queryKey })
		}

		void setExtended([...extended, Number(content?.next_parent_id)])
	}

	return (
		<div className="mt-5 flex animate-fade-in-up items-center justify-center gap-2">
			<Button
				tooltip="Previous Episode"
				variant="outline"
				size="icon"
				className="rounded-full"
				disabled={!firstEpisode?.previous_parent_id}
				onClick={() =>
					void handleEpisodeChange(firstEpisode?.previous_parent_id)
				}
			>
				<CircleArrowLeft />
			</Button>
			<Button
				tooltip="Next Episode"
				disabled={!lastEpisode?.next_parent_id}
				className="rounded-full"
				size="icon"
				onClick={() => void handleEpisodeChange(lastEpisode?.next_parent_id)}
			>
				<CircleArrowRight />
			</Button>
			<Button
				tooltip="Episode Extension"
				disabled={!content?.next_parent_id}
				onClick={() => void handleEpisodeSplit()}
				size="icon"
				variant="ghost"
			>
				<SeparatorHorizontal />
			</Button>
		</div>
	)
}
