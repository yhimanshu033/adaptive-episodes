'use client'

import React from 'react'
import {
	useCommentEditCancelButton,
	useCommentEditSaveButton,
	useCommentEditSaveButtonState,
	useCommentEditTextarea,
	useCommentEditTextareaState,
} from '@udecode/plate-comments/react'

import { Button } from '@/components/aural-ui/button'
import TextArea from '@/components/aural-ui/textarea'

export function CommentValue() {
	const textareaState = useCommentEditTextareaState()
	const { props: textareaProps } = useCommentEditTextarea(textareaState)

	const saveButtonState = useCommentEditSaveButtonState()
	const { props: saveButtonProps } = useCommentEditSaveButton(saveButtonState)
	const { props: cancelButtonProps } = useCommentEditCancelButton()

	return (
		<div className="relative flex grow flex-col gap-2">
			<TextArea
				{...textareaProps}
				minHeight={70}
				autoGrow={true}
				decoration="filled"
				classes={{
					textarea: 'pb-14',
				}}
			/>

			<div className="border-fm-divider-secondary absolute inset-x-0 bottom-1 mx-3 flex items-center justify-end gap-4 border-t pr-2">
				<Button
					{...cancelButtonProps}
					variant="text"
					className="text-fm-primary"
					innerClassName="translate-none"
					size="sm"
				>
					Cancel
				</Button>
				<Button
					{...saveButtonProps}
					variant="text"
					className="!text-fm-sm text-fm-secondary-800"
					innerClassName="translate-none"
				>
					Save
				</Button>
			</div>
		</div>
	)
}
