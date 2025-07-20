import React, { memo, useEffect, useState } from 'react'
import useShowExampleVisibility from '@/store/comment-store'
import { useEditorPlugin } from 'platejs/react'

import { If } from '@/components/aural-ui/if-else'
import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { TDiscussion } from '@/components/editor/plugins/discussion-kit'
import { suggestionPlugin } from '@/components/editor/plugins/suggestion-kit'
import { Comment, CommentCreateForm } from '@/components/plate-ui-v2/comment'
import { cn } from '@/lib/utils/helpers'

export default function CommentCard({
	discussion,
	activeId,
	myUserId,
}: {
	activeId: string | null
	discussion: TDiscussion
	myUserId: string | null
}) {
	const [editingId, setEditingId] = useState<string | null>(null)
	const ref = React.useRef<HTMLDivElement>(null)
	const isVisible = useShowExampleVisibility((s) => s.isVisible(discussion.id))
	const { setOption } = useEditorPlugin(commentPlugin)
	const { setOption: setSuggestionOption } = useEditorPlugin(suggestionPlugin)

	const handleCommentCardClick = () => {
		setOption('activeId', discussion.id)
		setSuggestionOption('activeId', null)
		const elem = document.getElementById('comment-leaf-' + discussion.id)
		if (!elem) {
			return
		}
		elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
	}

	useEffect(() => {
		if (ref.current && activeId === discussion.id) {
			ref.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [ref, activeId, discussion.id])

	useEffect(() => {
		if (isVisible) {
			const placeholder = document.getElementById(
				`example-placeholder-${discussion.id}`
			)
			if (placeholder) {
				placeholder.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
			}
		}
	}, [isVisible, discussion.id])

	return (
		<div
			ref={ref}
			role="button"
			onMouseDown={handleCommentCardClick}
			className={cn(
				'border-fm-divider-tertiary hover:bg-fm-divider-secondary/10 cursor-pointer rounded-xs border bg-transparent p-4 transition-all duration-200',
				{
					'border-fm-divider-secondary bg-fm-divider-secondary/15 shadow-sm':
						activeId === discussion.id,
				}
			)}
		>
			<div className="space-y-3">
				{discussion.comments.map((comment, index) => {
					if (activeId !== discussion.id && index > 0) {
						return null
					}
					return (
						<Comment
							key={comment.id ?? index}
							comment={comment}
							setEditingId={setEditingId}
							editingId={editingId}
							index={index}
							discussionLength={discussion.comments.length}
							isResolved={discussion.isResolved}
						/>
					)
				})}
				<If condition={!!myUserId && activeId === discussion.id && !isVisible}>
					<CommentCreateForm discussionId={discussion.id} />
				</If>
			</div>

			<div id={`example-placeholder-${discussion.id}`} className="mt-2" />
		</div>
	)
}

export const MemoizedCommentCard = memo(CommentCard)
