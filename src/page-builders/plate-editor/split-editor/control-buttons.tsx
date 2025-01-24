import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { extendStore } from '@/hooks/use-editor-extend-state'
import useSaving from '@/hooks/use-saving'
import {
	CircleArrowLeft,
	CircleArrowRight,
	SeparatorHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ControlButtons() {
	const router = useRouter()
	const { id } = useParams()
	const { setExtended, extended } = extendStore()

	const { data: content } = useEpisodeContent()
	const { isSaved, handleSave } = useSaving()

	const handleEpisodeChange = (episode: number | null) => {
		if (!episode) return
		if (!isSaved) void handleSave()
		router.push(`/projects/${String(id)}/${episode}/editor`)
	}

	return (
		content && (
			<div className="mt-5 flex animate-fade-in-up items-center justify-center gap-2">
				<Button
					tooltip="Previous Episode"
					variant="outline"
					size="icon"
					className="rounded-full"
					disabled={!content.previous_parent_id}
					onClick={() => handleEpisodeChange(content.previous_parent_id)}
				>
					<CircleArrowLeft />
				</Button>
				<Button
					tooltip="Next Episode"
					disabled={!content.next_parent_id}
					className="rounded-full"
					size="icon"
					onClick={() => handleEpisodeChange(content.next_parent_id)}
				>
					<CircleArrowRight />
				</Button>
				<Button
					tooltip="Episode Extension"
					disabled={!content.next_parent_id}
					onClick={() =>
						void setExtended([...extended, Number(content?.next_parent_id)])
					}
					size="icon"
					variant="ghost"
				>
					<SeparatorHorizontal />
				</Button>
			</div>
		)
	)
}
