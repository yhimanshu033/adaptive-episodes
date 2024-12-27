'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { extendStore } from '@/hooks/use-editor-extend-state'
import {
	CircleArrowLeft,
	CircleArrowRight,
	SeparatorHorizontal,
} from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import PlateEditor from './editor'

const ControlButtons = () => {
	const router = useRouter()
	const { id } = useParams()
	const { setExtended, extended } = extendStore()

	const { data: content } = useEpisodeContent()

	const handleEpisodeChange = (episode: number | null) => {
		if (!episode) return
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

const EditorChild = ({
	episodeId,
	isLast,
}: {
	episodeId: number
	isLast: boolean
}) => {
	return (
		<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
			<PlateEditor />
			{isLast ? <ControlButtons /> : <Separator />}
		</EpisodeIdProvider>
	)
}

const EpisodeSplit = ({ extended }: { extended: number[] }) =>
	extended.map((episodeId, idx) => (
		<EditorChild
			key={episodeId}
			episodeId={episodeId}
			isLast={idx === extended.length - 1}
		/>
	))

const EpisodePlateEditor = () => {
	const { extended, setExtended } = extendStore()
	const { episodeId } = useParams()

	useEffect(() => {
		setExtended([Number(episodeId)])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [episodeId])

	return (
		<main className="container flex flex-1 flex-col p-4">
			<DndProvider backend={HTML5Backend}>
				<div className="relative space-y-5">
					<EpisodeSplit extended={extended} />
				</div>
			</DndProvider>
		</main>
	)
}

export default EpisodePlateEditor
