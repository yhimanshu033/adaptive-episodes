'use client'

import React, { useRef } from 'react'
import {
	useCommentEditCancelButton,
	useCommentEditSaveButton,
	useCommentEditSaveButtonState,
	useCommentEditTextarea,
	useCommentEditTextareaState,
} from '@udecode/plate-comments/react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

export function CommentValue() {
	const textareaState = useCommentEditTextareaState()
	const { props: textareaProps } = useCommentEditTextarea(textareaState)

	const saveButtonState = useCommentEditSaveButtonState()
	const { props: saveButtonProps } = useCommentEditSaveButton(saveButtonState)
	const { props: cancelButtonProps } = useCommentEditCancelButton()

	const initialValue = useRef<string | null>(textareaState.value)

	const isUnchanged = initialValue.current === textareaState.value

	const handleSave = () => {
		toast.success('Comment updated successfully.')
		saveButtonProps.onClick()
	}

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

			<div className="border-fm-divider-secondary absolute inset-x-0 bottom-1 mx-3 flex items-center justify-end gap-1 border-t pr-2">
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
					onClick={handleSave}
					variant="text"
					innerClassName={cn('translate-none', {
						'!text-fm-inactive': isUnchanged,
					})}
					size="sm"
					disabled={isUnchanged}
				>
					Save
				</Button>
			</div>
		</div>
	)
}
