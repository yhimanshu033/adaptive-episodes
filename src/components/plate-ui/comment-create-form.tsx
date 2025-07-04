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
import { If } from '@/components/aural-ui/if-else'
import { TextAreaBase } from '@/components/aural-ui/textarea'
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
			<div
				className={cn(
					'border-fm-divider-primary bg-fm-surface-frosted/20 rounded-fm-s relative flex w-full flex-col overflow-hidden border py-2 transition-all duration-300 ease-in-out',
					{
						'border-fm-divider-contrast': focused,
						'gap-2 pb-1': showActions,
					}
				)}
			>
				<TextAreaBase
					{...textAreaProps}
					autoFocus={autoFocus}
					placeholder="Reply"
					value={textAreaValue}
					onInput={handleInput}
					onBlur={handleBlur}
					onFocus={handleFocus}
					decoration="filled"
					minHeight={showActions ? 40 : 20}
					maxHeight={showActions ? 90 : 20}
					autoGrow={true}
					unstyled={true}
					className="placeholder:text-fm-tertiary w-full resize-none px-3 text-sm outline-none placeholder:text-sm"
				/>
				<div
					className={cn(
						'max-h-0 overflow-hidden px-3 opacity-0 transition-all duration-300 ease-in-out',
						{ 'max-h-10 opacity-100': showActions }
					)}
				>
					<div className="flex flex-col gap-1">
						<Divider />
						<div className="flex items-center justify-end gap-4">
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
				</div>
				<PaperPlaneIcon
					className={cn(
						'text-fm-icon-inactive absolute top-2 right-3 size-4.5 opacity-100 transition-opacity duration-300',
						{ 'opacity-0': showActions }
					)}
				/>
			</div>
		</div>
	)
}
