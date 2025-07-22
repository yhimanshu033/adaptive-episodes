import React, { useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import WriterCombobox from '@/page-builders/episodes/writer-combobox'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorReadOnly } from '@udecode/plate-common/react'

import EditableText from '@/components/editable-text'
import { If } from '@/components/if-else'
import Spinner from '@/components/ui/spinner'
import { getSelectedEpisode } from '@/lib/utils/helpers'

const Title = ({
	chapterId,
	memberId,
}: {
	chapterId?: string
	memberId?: string
}) => {
	const { data: episodeContent } = useEpisodeContent()
	const readOnly = useEditorReadOnly()
	const { setCurrentTitle } = useEpisodeIdStore()
	const { data: episodeInfo } = useEpisodeInfo()

	const updatedAt = useMemo(() => {
		if (!episodeInfo?.results?.data) {
			return null
		}
		const latestEpisode = getSelectedEpisode(episodeInfo)
		const updateTime = latestEpisode?.episode.update_time
		if (!updateTime) {
			return null
		}
		const date = new Date(updateTime)
		return date.toLocaleString()
	}, [episodeInfo])

	const updateChapterTitle = (chapter_title: string) => {
		setCurrentTitle(chapter_title)
	}

	return (
		<div>
			<div className="flex items-center justify-center gap-2">
				<If condition={!episodeContent}>
					<Spinner size={24} />
				</If>

				<div className="flex items-center gap-2">
					<p className="text-xl">{episodeContent?.chapter.seq_number}.</p>
					<EditableText
						key={episodeContent?.chapter.chapter_title}
						text={episodeContent?.chapter.chapter_title || ''}
						rootClass="text-xl"
						inputClass="text-xl"
						isEditable={!readOnly}
						onComplete={(title) => void updateChapterTitle(title)}
					/>
					<WriterCombobox
						chapterId={chapterId}
						selectedMemberId={memberId}
						className="ml-2 origin-left scale-75"
					/>
				</div>
			</div>
			{updatedAt && (
				<p className="text-foreground/50 text-xs italic">
					(Last updated: {updatedAt})
				</p>
			)}
		</div>
	)
}

export default Title
