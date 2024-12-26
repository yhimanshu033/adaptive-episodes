import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

import { EStatus } from '@/types/common'

const Title = () => {
	const router = useRouter()
	const { id } = useParams()
	const { data: episodeContent, latestStatus } = useEpisodeContent()
	const { saveEpisodeMutation } = useEpisodeHook()
	const readOnly = useEditorReadOnly()

	const handleClick = () => {
		router.push(`/projects/${String(id)}`)
	}

	const updateChapterTitle = (chapter_title: string) => {
		if (episodeContent?.chapter.chapter_title === chapter_title) return
		saveEpisodeMutation.mutate({
			chapter_title,
			text: episodeContent?.text || '',
			status: latestStatus || EStatus.FIRST_DRAFT,
		})
	}

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon" onClick={handleClick}>
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
				onComplete={updateChapterTitle}
			/>
		</div>
	)
}

export default Title
