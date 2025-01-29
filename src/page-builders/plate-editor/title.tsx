import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
	EPISODE_LIMIT,
	EPISODE_LIST_QUERY_KEY,
} from '@/constants/episodes-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

const Title = () => {
	const router = useRouter()
	const { id } = useParams()
	const { data: episodeContent } = useEpisodeContent()
	const readOnly = useEditorReadOnly()
	const { handleSave, isSaved } = useSaving()
	const queryClient = useQueryClient()
	const { setCurrentTitle, setStartOverlayLoading } = useEpisodeIdStore()

	const handleClick = async () => {
		const page = Math.ceil(
			Number(episodeContent?.chapter.seq_number || 1) / EPISODE_LIMIT
		)
		if (!isSaved) {
			setStartOverlayLoading(true)
			await handleSave()
		}
		router.push(`/projects/${String(id)}${page === 1 ? '' : `?page=${page}`}`)
		await queryClient.refetchQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY],
		})
	}

	const updateChapterTitle = (chapter_title: string) => {
		setCurrentTitle(chapter_title)
	}

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon" onClick={() => void handleClick()}>
				<ArrowLeft size={16} />
			</Button>
			{episodeContent ? (
				<p className="text-xl">{episodeContent?.chapter.seq_number}.</p>
			) : (
				<Spinner size={24} />
			)}
			<EditableText
				key={episodeContent?.chapter.chapter_title}
				text={decodeURIComponent(episodeContent?.chapter.chapter_title || '')}
				rootClass="text-xl"
				inputClass="text-xl"
				isEditable={!readOnly}
				onComplete={(title) => void updateChapterTitle(title)}
			/>
		</div>
	)
}

export default Title
