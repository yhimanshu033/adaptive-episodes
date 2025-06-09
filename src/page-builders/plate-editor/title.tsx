import React, { useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import WriterCombobox from '@/page-builders/episodes/table/writer-combobox'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorReadOnly } from '@udecode/plate-common/react'

import EditableText from '@/components/editable-text'
import { If } from '@/components/if-else'
import CircularLoader from '@/components/ui/circular-loader'

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

	const updatedAt = useMemo(() => {
		const updateTime = episodeContent?.chapter.update_time
		if (!updateTime) {
			return null
		}
		const date = new Date(updateTime)
		return date.toLocaleString()
	}, [episodeContent])

	const updateChapterTitle = (chapter_title: string) => {
		setCurrentTitle(chapter_title)
	}

	return (
		<div>
			<div className="flex items-center justify-center gap-2">
				<If condition={!episodeContent}>
					<CircularLoader className="size-6" />
				</If>

				<div className="flex items-center gap-2">
					<p className="text-fm-primary font-fm-text [font-size:var(--text-fm-lg)]">
						E{episodeContent?.chapter.seq_number}.
					</p>
					<EditableText
						key={episodeContent?.chapter.chapter_title}
						text={episodeContent?.chapter.chapter_title || ''}
						rootClass="text-xl"
						inputClass="text-fm-primary font-fm-text [font-size:var(--text-fm-lg)]"
						textClass="text-fm-primary font-fm-text [font-size:var(--text-fm-lg)]"
						isEditable={!readOnly}
						onComplete={(title) => void updateChapterTitle(title)}
					/>
					<WriterCombobox
						chapterId={chapterId}
						selectedMemberId={memberId}
						className="font-fm-brand ml-2 w-30 rounded-full px-4 py-2 [font-size:var(--text-fm-sm)] capitalize"
						iconClass="size-4"
					/>
				</div>
			</div>
			{updatedAt && (
				<p className="text-fm-tertiary font-fm-brand [font-size:var(--text-fm-sm)]">
					(Last updated: {updatedAt})
				</p>
			)}
		</div>
	)
}

export default Title
