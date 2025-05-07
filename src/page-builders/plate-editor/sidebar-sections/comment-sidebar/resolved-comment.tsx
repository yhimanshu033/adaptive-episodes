import React from 'react'
import { roleToData } from '@/constants/global-constants'
import useComments from '@/hooks/plate/use-comments'
import { formatDistance } from 'date-fns'
import { ReplyIcon, Undo } from 'lucide-react'

import { Icons } from '@/components/icons'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { buttonVariants, cn } from '@/lib/utils/helpers'
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
		addComment(resolvedComment)
		removeResolvedComment(resolvedComment)
	}

	function handleResolve() {
		deleteResolvedComment(resolvedComment)
	}

	return (
		<div
			role="button"
			onMouseDown={() => {
				makeResolvedCommentActive(resolvedComment.id)
				const elem = document.getElementById(
					'resolved-comment-leaf-' + resolvedComment.id
				)
				if (!elem) {
					return
				}
				elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
			}}
			className={cn(
				'p-4',
				activeResolvedCommentId === resolvedComment.id
					? '~border-b border-l-2 border-b-primary bg-background/90'
					: 'hover:bg-background/30'
			)}
		>
			<div>
				<div className="flex items-center gap-1 pb-2 text-xs text-muted-foreground">
					<ReplyIcon size={8} className="rotate-180" />
					<h1 className="w-64 truncate">{resolvedComment.node.text}</h1>
				</div>
				<div className="relative flex items-center gap-2">
					<CommentAvatar userId={resolvedComment?.userId} />

					<h4 className="text-sm font-semibold leading-none">{user?.name}</h4>
					{userTitle && (
						<Badge
							variant="outline"
							className="bg-muted text-xxs leading-none text-muted-foreground"
						>
							{userTitle}
						</Badge>
					)}

					<div className="text-xs leading-none text-muted-foreground">
						{formatDistance(resolvedComment.createdAt, Date.now())} ago
					</div>

					<div className="absolute -right-0.5 -top-0.5 flex space-x-1">
						<Button
							variant="ghost"
							tooltip="Accept"
							onClick={handleResolve}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'h-6 p-1 text-muted-foreground'
							)}
						>
							<Icons.check className="size-4" />
						</Button>
						<Button
							tooltip="Unresolve"
							variant="ghost"
							onClick={handleRestore}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'h-6 p-1 text-muted-foreground'
							)}
						>
							<Undo className="size-4" />
						</Button>
					</div>
				</div>

				<div className="mb-4 pl-7 pt-0.5">
					<div className="whitespace-pre-wrap text-sm">
						{getText(resolvedComment.value)}
					</div>
				</div>
			</div>
		</div>
	)
}
