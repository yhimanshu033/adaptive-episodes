import React from 'react'
import { useRouter } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'

const Title = ({
	title,
	episodeNumber,
}: {
	episodeNumber: number
	title: string
}) => {
	const router = useRouter()
	const { data: episodeContent } = useEpisodeContent()
	const { saveEpisodeMutation } = useEpisodeHook()
	const readOnly = useEditorReadOnly()

	const handleClick = () => {
		router.back()
	}

	const updateChapterTitle = (chapter_title: string) => {
		if (episodeContent?.chapter.chapter_title === chapter_title) return
		saveEpisodeMutation.mutate({
			chapter_title,
			text: episodeContent?.text || '',
		})
	}

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon" onClick={handleClick}>
				<ArrowLeft size={16} />
			</Button>
			<p className="text-xl">{episodeNumber}.</p>
			<EditableText
				key={title}
				text={decodeURIComponent(title)}
				rootClass="text-xl"
				inputClass="text-xl"
				isEditable={!readOnly}
				onComplete={updateChapterTitle}
			/>
		</div>
	)
}

export default Title
