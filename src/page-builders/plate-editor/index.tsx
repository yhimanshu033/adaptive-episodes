'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useEditorExtendState } from '@/hooks/use-editor-extend-state'
import {
	CircleArrowLeft,
	CircleArrowRight,
	SeparatorHorizontal,
} from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { TooltipProvider } from '@/components/plate-ui/tooltip'
import { Button } from '@/components/ui/button'
import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import PlateEditor from './editor'

const EpisodePlateEditor = () => {
	const router = useRouter()
	const { id } = useParams()
	const { extended, setExtended } = useEditorExtendState()

	const { data: content } = useEpisodeContent(
		undefined,
		extended[extended.length - 1]
	)

	const handleEpisodeChange = (episode: number | null) => {
		if (!episode) return
		router.push(
			`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id as string}/${episode}/editor`
		)
	}
	return (
		<main className="container flex flex-1 animate-fade-in-up flex-col p-4">
			<DndProvider backend={HTML5Backend}>
				<div className="space-y-5">
					{extended.map((episodeId) => (
						<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
							<TooltipProvider
								disableHoverableContent
								delayDuration={500}
								skipDelayDuration={0}
							>
								<PlateEditor />
							</TooltipProvider>
						</EpisodeIdProvider>
					))}
				</div>
			</DndProvider>
			{content && (
				<div className="mt-5 flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full"
						disabled={!content.previous_parent_id}
						onClick={() => handleEpisodeChange(content.previous_parent_id)}
					>
						<CircleArrowLeft />
					</Button>
					<Button
						disabled={!content.next_parent_id}
						className="rounded-full"
						size="icon"
						onClick={() => handleEpisodeChange(content.next_parent_id)}
					>
						<CircleArrowRight />
					</Button>
					<Button
						onClick={() =>
							void setExtended((prev) => [
								...prev,
								Number(content?.next_parent_id),
							])
						}
						size="icon"
						variant="ghost"
					>
						<SeparatorHorizontal />
					</Button>
				</div>
			)}
		</main>
	)
}

export default EpisodePlateEditor
