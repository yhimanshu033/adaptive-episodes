import React from 'react'
import { roleToData } from '@/constants/global-constants'
import useComments from '@/hooks/plate/use-comments'
import { CircleCrossIcon } from '@/icons/circle-cross-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import { formatDistance } from 'date-fns'
import { toast } from 'sonner'

import Badge from '@/components/aural-ui/badge'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { cn } from '@/lib/aural-ui/utils'
import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { getText } from '@/lib/utils/plate'

import { TCustomComment } from '@/types/editor-types'
import { PlateUser } from '@/types/plate-types'

export default function ResolvedCommentItem({
	resolvedComment,
}: {
	resolvedComment: TCustomComment
}) {
	const {
		activeResolvedCommentId,
		getUser,
		makeResolvedCommentActive,
		removeResolvedComment,
		deleteResolvedComment,
	} = useResolvedComments()

	const { addComment } = useComments()

	const user = getUser(resolvedComment?.userId) as PlateUser | undefined

	const userTitle = user ? roleToData[user.role]?.title : ''

	function handleRestore() {
		toast.success('Comment unresolved successfully.')
		addComment(resolvedComment)
		removeResolvedComment(resolvedComment)
	}

	function handleResolve() {
		toast.success('Resolved comment accepted successfully.')
		deleteResolvedComment(resolvedComment)
	}

	const handleResolvedCommentCardClick = () => {
		makeResolvedCommentActive(resolvedComment.id)
		const elem = document.getElementById(
			'resolved-comment-leaf-' + resolvedComment.id
		)
		if (!elem) {
			return
		}
		elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
	}

	return (
		<div
			role="button"
			onMouseDown={handleResolvedCommentCardClick}
			className={cn(
				'border-fm-divider-tertiary rounded-xs border bg-transparent p-4',
				{
					'border-fm-divider-secondary bg-fm-divider-secondary/15':
						activeResolvedCommentId === resolvedComment.id,
				}
			)}
		>
			<div className="space-y-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<CommentAvatar userId={resolvedComment?.userId} />
						<div className="flex flex-col">
							<div className="flex gap-2">
								<Typography color="primary" variant="body-small">
									{user?.name}
								</Typography>
								<If condition={!!userTitle}>
									<Badge size="xs">{userTitle}</Badge>
								</If>
							</div>

							<Typography variant="caption-medium" color="tertiary">
								{formatDistance(resolvedComment.createdAt, Date.now())} ago
							</Typography>
						</div>
					</div>

					<div className="flex items-center">
						<IconButton
							label="Accept"
							variant="ghost"
							size="small"
							onClick={handleResolve}
							className="hover:!text-fm-primary text-fm-icon-inactive"
							icon={<CircleTickIcon className="size-4 text-inherit" />}
							shape="square"
							tooltip={'Accept'}
							tooltipContentProps={{
								align: 'end',
								side: 'bottom',
							}}
						/>
						<IconButton
							label="Unresolve"
							variant="ghost"
							size="small"
							onClick={handleRestore}
							className="hover:!text-fm-primary text-fm-icon-inactive"
							icon={<CircleCrossIcon className="size-4.5 text-inherit" />}
							shape="square"
							tooltip={'Unresolve'}
							tooltipContentProps={{
								align: 'end',
								side: 'bottom',
							}}
						/>
					</div>
				</div>

				<Typography
					className="whitespace-pre-wrap"
					color="tertiary"
					variant="body-small"
				>
					{getText(resolvedComment.value)}
				</Typography>
			</div>
		</div>
	)
}
