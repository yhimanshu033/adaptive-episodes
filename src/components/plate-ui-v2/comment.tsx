/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { roleToData } from '@/constants/global-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import { CopyIcon } from '@/icons/copy-icon'
import { PageSearchIcon } from '@/icons/page-search-icon'
import { PaperPlaneIcon } from '@/icons/paper-plane-icon'
import { VerticalMenuIcon } from '@/icons/vertical-menu-icon'
import useAIStore from '@/store/ai-store'
import { getCommentKey, getDraftCommentKey } from '@platejs/comment'
import { CommentPlugin, useCommentId } from '@platejs/comment/react'
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
	formatDistance,
} from 'date-fns'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { KEYS, nanoid, NodeApi, type Value } from 'platejs'
import type { CreatePlateEditorOptions } from 'platejs/react'
import {
	Plate,
	useEditorPlugin,
	useEditorReadOnly,
	useEditorRef,
	usePlateEditor,
	usePluginOption,
} from 'platejs/react'
import { toast } from 'sonner'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'
import { Button } from '@/components/aural-ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit'
import {
	discussionPlugin,
	type TDiscussion,
} from '@/components/editor/plugins/discussion-kit'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'
import { resolveEditorComment } from '@/lib/utils/plate'

import Badge from '../aural-ui/badge'
import { Divider } from '../aural-ui/divider'
import { IconButton } from '../aural-ui/icon-button'
import { Else, If, IfElse } from '../aural-ui/if-else'
import Label from '../aural-ui/label'
import { Typography } from '../aural-ui/typography'
import { commentPlugin } from '../editor/plugins/comment-kit'
import CommentExampleContent from '../plate-ui/comment-example-content'
import CommentValue from './comment-value'
import { Editor } from './editor'

export interface TComment {
	contentRich: Value
	createdAt: Date
	discussionId: string
	id: string
	isEdited: boolean
	userId: string
}

export function Comment(props: {
	comment: TComment
	discussionLength: number
	documentContent?: string
	editingId: string | null
	index: number
	isResolved?: boolean
	onEditorClick?: () => void
	setEditingId: React.Dispatch<React.SetStateAction<string | null>>
	showDocumentContent?: boolean
}) {
	const {
		comment,
		discussionLength,
		editingId,
		index,
		setEditingId,
		onEditorClick,
		isResolved = false,
	} = props

	const editor = useEditorRef()
	const userInfo = usePluginOption(discussionPlugin, 'user', comment.userId)
	const userTitle = userInfo?.role ? roleToData[userInfo.role]?.title : ''
	const readOnly = useEditorReadOnly()
	const activeCommentId = editor.getOption(commentPlugin, 'activeId')
	const { mutateAsync, data } = useCommentExampleHook(comment)
	const { addActiveCommentExampleMap } = useAIStore()

	const resolveDiscussion = (id: string) => {
		const updatedDiscussions = editor
			.getOption(discussionPlugin, 'discussions')
			.map((discussion) => {
				if (discussion.id === id) {
					return { ...discussion, isResolved: true }
				}
				return discussion
			})
		editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)
	}

	const removeDiscussion = (id: string) => {
		const updatedDiscussions = editor
			.getOption(discussionPlugin, 'discussions')
			.filter((discussion) => discussion.id !== id)
		editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)
	}

	const updateComment = (input: {
		contentRich: Value
		discussionId: string
		id: string
		isEdited: boolean
	}) => {
		const updatedDiscussions = editor
			.getOption(discussionPlugin, 'discussions')
			.map((discussion) => {
				if (discussion.id === input.discussionId) {
					const updatedComments = discussion.comments.map((comment) => {
						if (comment.id === input.id) {
							return {
								...comment,
								contentRich: input.contentRich,
								isEdited: true,
								updatedAt: new Date(),
							}
						}
						return comment
					})
					return { ...discussion, comments: updatedComments }
				}
				return discussion
			})
		editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)
	}

	const { tf } = useEditorPlugin(commentPlugin)

	const initialValue = comment.contentRich

	const commentEditor = useCommentEditor(
		{
			id: comment.id,
			value: initialValue,
		},
		[initialValue]
	)

	const onCancel = () => {
		setEditingId(null)
		commentEditor.tf.replaceNodes(initialValue, {
			at: [],
			children: true,
		})
	}

	const onSave = () => {
		void updateComment({
			id: comment.id,
			contentRich: commentEditor.children,
			discussionId: comment.discussionId,
			isEdited: true,
		})
		setEditingId(null)
	}

	const onResolveComment = () => {
		void resolveDiscussion(comment.discussionId)
		resolveEditorComment(editor, comment.discussionId)
	}

	async function onExample() {
		const taskId = await mutateAsync()
		addActiveCommentExampleMap({ key: comment.id, value: taskId })
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.COMMENT_EXAMPLE,
				flowId: taskId,
			},
		})
	}

	const handleCopy = (data: string | null) => {
		if (!data) {
			return
		}
		toast.success('Comment copied successfully.', {
			icon: <BubbleCheckIcon />,
		})
		void navigator.clipboard.writeText(data)
	}

	const commentText = React.useMemo(
		() => NodeApi.string({ children: comment.contentRich, type: KEYS.p }),
		[comment.contentRich]
	)

	const isFirst = index === 0
	const isReplyComment = index > 0
	const replyCount = discussionLength - 1
	const isEditing = editingId && editingId === comment.id

	const [dropdownOpen, setDropdownOpen] = React.useState(false)

	return (
		<>
			<If condition={isReplyComment}>
				<Divider variant="secondary" className="mb-4" />
			</If>
			<div
				className="space-y-3"
				onClick={() => {
					const elem = document.getElementById('comment-leaf-' + comment.id)
					if (!elem) {
						return
					}
					elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
				}}
			>
				<div className="group relative flex items-center justify-between gap-2">
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
								{formatDistance(comment.createdAt, Date.now())} ago
							</Typography>
						</div>
					</div>

					<If condition={!readOnly}>
						<div className="flex items-center">
							<If condition={isReplyComment && userInfo?.id === AI_USER_ID}>
								<IconButton
									label="copy button"
									variant="ghost"
									size="small"
									onClick={() => handleCopy(commentText)}
									className="hover:!text-fm-primary text-fm-icon-inactive opacity-0 transition-opacity"
									icon={<CopyIcon className="size-4 text-inherit" />}
									shape="square"
								/>
							</If>
							<If
								condition={
									!isResolved &&
									((activeCommentId === comment.discussionId && isFirst) ||
										dropdownOpen)
								}
							>
								<CommentMoreDropdown
									onCloseAutoFocus={() => {
										setTimeout(() => {
											commentEditor.tf.focus({ edge: 'endEditor' })
										}, 0)
									}}
									onRemoveComment={() => {
										if (index === 0) {
											tf.comment.unsetMark({ id: comment.discussionId })
											void removeDiscussion(comment.discussionId)
										}
									}}
									comment={comment}
									index={index}
									dropdownOpen={dropdownOpen}
									setDropdownOpen={setDropdownOpen}
									setEditingId={setEditingId}
									onExample={() => void onExample()}
									isReplyComment={isReplyComment}
								/>
							</If>

							<If
								condition={
									!isReplyComment && activeCommentId === comment.discussionId
								}
							>
								<IconButton
									label="Resolve"
									variant="ghost"
									onClick={onResolveComment}
									className="hover:!text-fm-primary text-fm-icon-inactive p-2"
									size="small"
									icon={<CircleTickIcon className="size-4.5 text-inherit" />}
									tooltip="Mark as Resolved"
									tooltipContentProps={{
										align: 'end',
										side: 'bottom',
									}}
								/>
							</If>
						</div>
					</If>
				</div>

				<div className="mb-4 pt-0.5">
					<IfElse condition={!!isEditing}>
						<If>
							<Plate editor={commentEditor}>
								<CommentValue
									commentText={commentText}
									isEditing={!!isEditing}
									onCancel={onCancel}
									onSave={onSave}
									onEditorClick={onEditorClick}
								/>
							</Plate>
						</If>
						<Else>
							<Typography
								className="break-words whitespace-pre-wrap"
								color="tertiary"
								variant="body-small"
							>
								{commentText}
							</Typography>
						</Else>
					</IfElse>
				</div>
				<CommentExampleContent comment={comment} data={data} />
				<If
					condition={replyCount > 0 && activeCommentId !== comment.discussionId}
				>
					<Label className="text-fm-secondary-800">
						{replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
					</Label>
				</If>
			</div>
		</>
	)
}

export function CommentMoreDropdown(props: {
	comment: TComment
	dropdownOpen: boolean
	index: number
	isReplyComment?: boolean
	onCloseAutoFocus?: () => void
	onExample?: () => void
	onRemoveComment?: () => void
	setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
	setEditingId: React.Dispatch<React.SetStateAction<string | null>>
}) {
	const {
		comment,
		index,
		dropdownOpen,
		setDropdownOpen,
		setEditingId,
		onCloseAutoFocus,
		onRemoveComment,
		isReplyComment = false,
		onExample = () => {},
	} = props

	const editor = useEditorRef()

	const selectedEditCommentRef = React.useRef<boolean>(false)

	const onDeleteComment = React.useCallback(() => {
		if (!comment.id) {
			return alert('You are operating too quickly, please try again later.')
		}

		// Find and update the discussion
		const updatedDiscussions = editor
			.getOption(discussionPlugin, 'discussions')
			.map((discussion) => {
				if (discussion.id !== comment.discussionId) {
					return discussion
				}

				const commentIndex = discussion.comments.findIndex(
					(c) => c.id === comment.id
				)
				if (commentIndex === -1) {
					return discussion
				}

				return {
					...discussion,
					comments: [
						...discussion.comments.slice(0, commentIndex),
						...discussion.comments.slice(commentIndex + 1),
					],
				}
			})

		// Save back to session storage
		editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)
		onRemoveComment?.()
	}, [comment.discussionId, comment.id, editor, onRemoveComment])

	const onEditComment = React.useCallback(() => {
		selectedEditCommentRef.current = true

		if (!comment.id) {
			return alert('You are operating too quickly, please try again later.')
		}

		setEditingId(comment.id)
	}, [comment.id, setEditingId])

	return (
		<DropdownMenu
			open={dropdownOpen}
			onOpenChange={setDropdownOpen}
			modal={false}
		>
			<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
				<IconButton
					label="Trigger dropdown"
					variant="ghost"
					icon={<VerticalMenuIcon className="size-4 text-inherit" />}
					shape="square"
					size="small"
					className={cn(
						'hover:!text-fm-primary text-fm-icon-inactive transition-opacity disabled:bg-transparent',
						{ 'opacity-100': dropdownOpen }
					)}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-48"
				align="end"
				onCloseAutoFocus={(e) => {
					if (selectedEditCommentRef.current) {
						onCloseAutoFocus?.()
						selectedEditCommentRef.current = false
					}

					return e.preventDefault()
				}}
			>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={onEditComment}
						className="py-2 [font-size:var(--text-fm-md)]"
					>
						<PencilIcon className="size-4" />
						Edit comment
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={onDeleteComment}
						className="py-2 [font-size:var(--text-fm-md)]"
					>
						<TrashIcon className="size-4" />
						Delete {!index ? 'Thread' : 'Comment'}
					</DropdownMenuItem>
					<If condition={!isReplyComment && comment.userId === AI_USER_ID}>
						<DropdownMenuItem
							onClick={onExample}
							className="py-2 [font-size:var(--text-fm-md)]"
						>
							<PageSearchIcon className="size-4" />
							Show Example
						</DropdownMenuItem>
					</If>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const useCommentEditor = (
	options: Omit<CreatePlateEditorOptions, 'plugins'> = {},
	deps: any[] = []
) => {
	const commentEditor = usePlateEditor(
		{
			id: 'comment',
			plugins: BasicMarksKit,
			value: [],
			...options,
		},
		deps
	)

	return commentEditor
}

export function CommentCreateForm({
	autoFocus = false,
	className,
	discussionId: discussionIdProp,
	focusOnMount = false,
}: {
	autoFocus?: boolean
	className?: string
	discussionId?: string
	focusOnMount?: boolean
}) {
	const discussions = usePluginOption(discussionPlugin, 'discussions')

	const editor = useEditorRef()
	const commentId = useCommentId()
	const discussionId = discussionIdProp ?? commentId

	const userInfo = usePluginOption(discussionPlugin, 'currentUser')
	const [commentValue, setCommentValue] = React.useState<Value | undefined>()
	const [focused, setFocused] = React.useState<boolean>(false)
	const hasContent = React.useMemo(
		() =>
			commentValue
				? NodeApi.string({ children: commentValue, type: KEYS.p }).trim()
						.length > 0
				: false,
		[commentValue]
	)
	const commentEditor = useCommentEditor()

	React.useEffect(() => {
		if (commentEditor && focusOnMount) {
			commentEditor.tf.focus()
		}
	}, [commentEditor, focusOnMount])

	const onAddComment = React.useCallback(() => {
		if (!commentValue) {
			return
		}

		commentEditor.tf.reset()

		if (discussionId) {
			// Get existing discussion
			const discussion = discussions.find((d) => d.id === discussionId)
			if (!discussion) {
				// Mock creating suggestion
				const newDiscussion: TDiscussion = {
					id: discussionId,
					comments: [
						{
							id: nanoid(),
							contentRich: commentValue,
							createdAt: new Date(),
							discussionId,
							isEdited: false,
							userId: editor.getOption(discussionPlugin, 'currentUserId'),
						},
					],
					createdAt: new Date(),
					isResolved: false,
					userId: editor.getOption(discussionPlugin, 'currentUserId'),
				}

				editor.setOption(discussionPlugin, 'discussions', [
					...discussions,
					newDiscussion,
				])
				return
			}

			// Create reply comment
			const comment: TComment = {
				id: nanoid(),
				contentRich: commentValue,
				createdAt: new Date(),
				discussionId,
				isEdited: false,
				userId: editor.getOption(discussionPlugin, 'currentUserId'),
			}

			// Add reply to discussion comments
			const updatedDiscussion = {
				...discussion,
				comments: [...discussion.comments, comment],
			}

			// Filter out old discussion and add updated one
			const updatedDiscussions = discussions
				.filter((d) => d.id !== discussionId)
				.concat(updatedDiscussion)

			editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)

			return
		}

		const commentsNodeEntry = editor
			.getApi(CommentPlugin)
			.comment.nodes({ at: [], isDraft: true })

		if (commentsNodeEntry.length === 0) {
			return
		}

		const documentContent = commentsNodeEntry
			.map(([node]) => node.text)
			.join('')

		const _discussionId = nanoid()
		// Mock creating new discussion
		const newDiscussion: TDiscussion = {
			id: _discussionId,
			comments: [
				{
					id: nanoid(),
					contentRich: commentValue,
					createdAt: new Date(),
					discussionId: _discussionId,
					isEdited: false,
					userId: editor.getOption(discussionPlugin, 'currentUserId'),
				},
			],
			createdAt: new Date(),
			documentContent,
			isResolved: false,
			userId: editor.getOption(discussionPlugin, 'currentUserId'),
		}

		editor.setOption(discussionPlugin, 'discussions', [
			...discussions,
			newDiscussion,
		])

		const id = newDiscussion.id

		commentsNodeEntry.forEach(([, path]) => {
			editor.tf.setNodes(
				{
					[getCommentKey(id)]: true,
				},
				{ at: path, split: true }
			)
			editor.tf.unsetNodes([getDraftCommentKey()], { at: path })
		})
	}, [commentValue, commentEditor.tf, discussionId, editor, discussions])

	const resetActiveCommentId = () => {
		editor.setOption(commentPlugin, 'activeId', null)
	}

	const handleCommentAdd = () => {
		void onAddComment()
		resetActiveCommentId()
	}

	const handleCancel = (forceCancel?: boolean) => {
		if (!hasContent || forceCancel) {
			editor.tf.unsetNodes(getDraftCommentKey(), {
				at: [],
				mode: 'lowest',
				match: (n) => n[getDraftCommentKey()],
			})
			resetActiveCommentId()
		}
	}

	const handleBlur = () => {
		setFocused(false)
		handleCancel()
	}

	return (
		<div className={cn('flex w-full items-center gap-2', className)}>
			<If condition={!discussionIdProp}>
				<div className="shrink-0">
					{/* Replace to your own backend or refer to potion */}
					<Avatar className="size-8">
						<AvatarImage alt={userInfo?.name} src={userInfo?.avatarUrl} />
						<AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
					</Avatar>
				</div>
			</If>

			<div
				className={cn(
					'border-fm-divider-primary bg-fm-surface-frosted/20 rounded-fm-s relative flex grow flex-col overflow-hidden border py-2 transition-all duration-300 ease-in-out',
					{
						'border-fm-divider-contrast': focused,
						'gap-2 pb-1': hasContent,
					}
				)}
			>
				<Plate
					onChange={({ value }) => {
						setCommentValue(value)
					}}
					editor={commentEditor}
				>
					<Editor
						variant="comment"
						className="placeholder:text-fm-tertiary w-full resize-none border-none px-3 text-sm outline-none placeholder:text-sm"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault()
								handleCommentAdd()
							}
						}}
						onFocus={() => setFocused(true)}
						placeholder="Reply..."
						autoComplete="off"
						autoFocus={autoFocus}
						onBlur={handleBlur}
					/>
					<div
						className={cn(
							'max-h-0 overflow-hidden px-3 opacity-0 transition-all duration-300 ease-in-out',
							{ 'max-h-10 opacity-100': hasContent }
						)}
					>
						<div className="flex flex-col gap-1">
							<Divider />
							<div className="flex items-center justify-end">
								<Button
									onClick={() => handleCancel(true)}
									variant="text"
									className="text-fm-primary"
									innerClassName="translate-none"
									size="sm"
								>
									Cancel
								</Button>
								<Button
									disabled={!hasContent}
									variant="text"
									innerClassName="translate-none"
									size="sm"
									onClick={(e) => {
										e.stopPropagation()
										handleCommentAdd()
									}}
								>
									Comment
								</Button>
							</div>
						</div>
					</div>
					<PaperPlaneIcon
						className={cn(
							'text-fm-icon-inactive absolute top-2 right-3 size-4.5 opacity-100 transition-opacity duration-300',
							{ 'opacity-0': hasContent }
						)}
					/>
				</Plate>
			</div>
		</div>
	)
}

export const formatCommentDate = (date: Date) => {
	const now = new Date()
	const diffMinutes = differenceInMinutes(now, date)
	const diffHours = differenceInHours(now, date)
	const diffDays = differenceInDays(now, date)

	if (diffMinutes < 60) {
		return `${diffMinutes}m`
	}
	if (diffHours < 24) {
		return `${diffHours}h`
	}
	if (diffDays < 2) {
		return `${diffDays}d`
	}

	return format(date, 'MM/dd/yyyy')
}
