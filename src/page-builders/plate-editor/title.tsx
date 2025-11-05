import React from 'react'
import { statuses, titleToStatusText } from '@/constants/episodes-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { useEditorReadOnly, useEpisodeIdStore } from 'unified-editor'

import EditableText from '@/components/editable-text'
import { If } from '@/components/if-else'
import CircularLoader from '@/components/ui/circular-loader'

const Title = ({
	memberId,
	latestIndex,
}: {
	latestIndex: number
	memberId?: string
}) => {
	const { data: episodeContent } = useEpisodeContent()
	const readOnly = useEditorReadOnly('editor')
	const { setCurrentTitle } = useEpisodeIdStore()
	const { data } = useUserMembersQuery()
	const members = data?.members || []

	const selectedMember = members?.find(
		(member) => member.user.id === Number(memberId)
	)

	const updateChapterTitle = (chapter_title: string) => {
		setCurrentTitle(chapter_title)
	}

	return (
		<div>
			<div className="flex items-center justify-center gap-2">
				<If condition={!episodeContent}>
					<CircularLoader className="size-6" />
				</If>

				<div className="flex flex-1 items-center gap-2">
					<p className="text-fm-primary font-fm-text text-fm-lg">
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
				</div>
			</div>
			<p className="text-fm-tertiary font-fm-brand text-fm-sm flex items-center justify-start gap-2 font-medium uppercase">
				{selectedMember?.user.fullname && (
					<>
						<span>{selectedMember?.user.fullname}</span>
						<span className="size-0.5 rounded-full bg-current" />
					</>
				)}
				<span>{titleToStatusText[statuses[latestIndex]]}</span>
			</p>
		</div>
	)
}

export default Title
