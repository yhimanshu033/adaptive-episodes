import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
	DEFAULT_EPISODE_LIMIT,
	EPISODE_LIST_QUERY_KEY,
} from '@/constants/episodes-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { getSelectedEpisode } from '@/lib/utils/helpers'

const Title = () => {
	const router = useRouter()
	const { id } = useParams()
	const { data: episodeContent } = useEpisodeContent()
	const readOnly = useEditorReadOnly()
	const { handleSave } = useSaving()
	const queryClient = useQueryClient()
	const { setCurrentTitle } = useEpisodeIdStore()
	const { data: episodeInfo } = useEpisodeInfo()

	const updatedAt = useMemo(() => {
		if (!episodeInfo?.results?.data) return null
		const latestEpisode = getSelectedEpisode(episodeInfo)
		const updateTime = latestEpisode?.episode.update_time
		if (!updateTime) return null
		const date = new Date(updateTime)
		return date.toLocaleString()
	}, [episodeInfo])

	const handleClick = async () => {
		const page = Math.ceil(
			Number(episodeContent?.chapter.seq_number || 1) / DEFAULT_EPISODE_LIMIT
		)
		await handleSave({ startOverlayLoading: true })
		router.push(`/projects/${String(id)}${page === 1 ? '' : `?page=${page}`}`)
		await queryClient.refetchQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY],
		})
	}

	const updateChapterTitle = (chapter_title: string) => {
		setCurrentTitle(chapter_title)
	}

	return (
		<div className="flex items-center justify-center gap-2">
			<Button variant="ghost" size="icon" onClick={() => void handleClick()}>
				<ArrowLeft size={16} />
			</Button>
			{episodeContent ? (
				<p className="text-xl">{episodeContent?.chapter.seq_number}.</p>
			) : (
				<Spinner size={24} />
			)}
			<div className="flex items-end gap-2">
				<EditableText
					key={episodeContent?.chapter.chapter_title}
					text={decodeURIComponent(episodeContent?.chapter.chapter_title || '')}
					rootClass="text-xl"
					inputClass="text-xl"
					isEditable={!readOnly}
					onComplete={(title) => void updateChapterTitle(title)}
				/>
				{updatedAt && (
					<p className="text-xs italic text-foreground/50">
						(Last updated: {updatedAt})
					</p>
				)}
			</div>
		</div>
	)
}

export default Title
