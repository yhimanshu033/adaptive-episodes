/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { PaperPlaneIcon } from '@/icons/paper-plane-icon'
import { cn } from '@udecode/cn'
import {
	CommentNewSubmitButton,
	CommentsPlugin,
	useCommentNewTextarea,
	useCommentNewTextareaState,
} from '@udecode/plate-comments/react'
import { useEditorPlugin, useEditorReadOnly } from '@udecode/plate-common/react'

import { CommentAvatar } from '@/components/plate-ui/comment-avatar'

import { Button, buttonVariants } from '../aural-ui/button'
import { Else, If, IfElse } from '../aural-ui/if-else'
import TextArea from '../aural-ui/textarea'

export function CommentCreateForm({ autoFocus }: { autoFocus?: boolean }) {
	const { useOption, setOption } = useEditorPlugin(CommentsPlugin)

	const myUserId = useOption('myUserId')
	const activeCommentId = useOption('activeCommentId')
	const comments = useOption('comments')

	const readOnly = useEditorReadOnly()
	const textAreaState = useCommentNewTextareaState()
	const { setOption: setTextareaOption, value: textAreaValue } = textAreaState

	const { props: textAreaProps } = useCommentNewTextarea(textAreaState)

	const [showActions, setShowActions] = useState(false)

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		const text = e.target.value.trim()

		if (!text) {
			setShowActions(false)
		}

		if (!text && activeCommentId && !comments[activeCommentId]) {
			setOption('activeCommentId', null)
		}
	}

	const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const text = e.currentTarget.value.trim()
		setShowActions(text.length > 0)
	}

	const handleCancel = () => {
		setShowActions(false)
		setTextareaOption('newValue', [
			{
				type: 'p',
				children: [{ text: '' }],
			},
		])
	}

	useEffect(() => {
		setTextareaOption('newValue', [
			{
				type: 'p',
				children: [{ text: '' }],
			},
		])
	}, [activeCommentId])

	if (readOnly) {
		return null
	}

	return (
		<div className="flex w-full items-start space-x-2">
			<If condition={!!activeCommentId && !comments[activeCommentId]}>
				<CommentAvatar userId={myUserId} />
			</If>
			<div className="relative flex grow flex-col gap-2">
				<TextArea
					{...textAreaProps}
					autoFocus={autoFocus}
					placeholder="Reply"
					value={textAreaValue}
					onInput={handleInput}
					onBlur={handleBlur}
					decoration="filled"
					minHeight={showActions ? 90 : 35}
					autoGrow={true}
					classes={{
						textarea: !showActions ? '!h-fit' : 'pb-12',
					}}
				/>
				<IfElse condition={showActions}>
					<If>
						<div className="border-fm-divider-secondary absolute inset-x-0 bottom-1 mx-3 flex items-center justify-end gap-4 border-t pr-2">
							<Button
								onClick={handleCancel}
								variant="text"
								className="text-fm-primary"
								innerClassName="translate-none"
								size="sm"
							>
								Cancel
							</Button>
							<CommentNewSubmitButton
								className={cn(
									buttonVariants({
										variant: 'text',
									}),
									'!text-fm-sm text-fm-secondary-800'
								)}
							>
								Comment
							</CommentNewSubmitButton>
						</div>
					</If>
					<Else>
						<PaperPlaneIcon className="text-fm-icon-inactive absolute top-3 right-3 size-4.5" />
					</Else>
				</IfElse>
			</div>
		</div>
	)
}
