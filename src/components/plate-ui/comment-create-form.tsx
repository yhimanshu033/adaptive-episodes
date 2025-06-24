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

import { Button, buttonVariants } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'

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
	const [focused, setFocused] = useState(false)

	const handleFocus = () => {
		setFocused(true)
	}

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		const text = e.target.value.trim()

		setFocused(false)

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
			<div className="relative flex w-full flex-col">
				<TextArea
					{...textAreaProps}
					autoFocus={autoFocus}
					placeholder="Reply"
					value={textAreaValue}
					onInput={handleInput}
					onBlur={handleBlur}
					onFocus={handleFocus}
					decoration="filled"
					minHeight={showActions ? 90 : 35}
					autoGrow={true}
					classes={{
						textarea: cn('', {
							'!border-b-0 !rounded-b-none mb-9': showActions,
							'!h-fit': !showActions,
						}),
					}}
				/>
				<IfElse condition={showActions}>
					<If>
						<div
							className={cn(
								'border-fm-divider-primary rounded-b-fm-s absolute inset-x-0 bottom-0 flex flex-col border border-t-0',
								{
									'border-fm-divider-contrast': focused,
								}
							)}
						>
							<Divider className="mt-2 w-[90%]" />

							<div className="bg-fm-surface-frosted/20 flex items-center justify-end gap-4 pr-4">
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
