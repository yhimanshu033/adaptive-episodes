import React from 'react'
import { roleToData } from '@/constants/global-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { CircleCrossIcon } from '@/icons/circle-cross-icon'
import { formatDistance } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { KEYS, NodeApi } from 'platejs'
import { useEditorPlugin, usePluginOption } from 'platejs/react'
import { toast } from 'sonner'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'
import Badge from '@/components/aural-ui/badge'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import {
	discussionPlugin,
	TDiscussion,
} from '@/components/editor/plugins/discussion-kit'
import { cn } from '@/lib/aural-ui/utils'
import { unresolveEditorComment } from '@/lib/utils/plate'

export default function ResolvedCommentItem({
	resolvedComment,
}: {
	resolvedComment: TDiscussion
}) {
	const {
		editor,
		getOption: getDiscussionOption,
		setOption: setDiscussionOption,
	} = useEditorPlugin(discussionPlugin)
	const discussions = usePluginOption(discussionPlugin, 'discussions')

	const userInfo = getDiscussionOption('user', resolvedComment.userId)

	const userTitle = userInfo.role ? roleToData[userInfo.role]?.title : ''

	const resolvedCommentText = NodeApi.string({
		children: resolvedComment?.comments[0].contentRich ?? [],
		type: KEYS.p,
	})

	function handleRestore() {
		toast.success('Comment unresolved successfully.', {
			icon: <BubbleCheckIcon />,
		})
		setDiscussionOption(
			'discussions',
			discussions.map((discussion) =>
				discussion.id === resolvedComment.id
					? { ...discussion, isResolved: false }
					: discussion
			)
		)
		unresolveEditorComment(editor, resolvedComment.id)
	}

	function handleResolve() {
		toast.success('Resolved comment deleted successfully.', {
			icon: <BubbleCheckIcon />,
		})
		setDiscussionOption(
			'discussions',
			discussions.filter((discussion) => discussion.id !== resolvedComment.id)
		)
	}

	return (
		<div
			role="button"
			className={cn(
				'border-fm-divider-tertiary rounded-xs border bg-transparent p-4'
			)}
		>
			<div className="space-y-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarImage alt={userInfo?.name} src={userInfo?.avatarUrl} />
							<AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<div className="flex gap-2">
								<Typography color="primary" variant="body-small">
									{userInfo?.name}
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
							icon={<Trash2 className="size-4 text-inherit" />}
							shape="square"
							tooltip={'Delete'}
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
					{resolvedCommentText}
				</Typography>
			</div>
		</div>
	)
}
