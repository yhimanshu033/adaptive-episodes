import React, { useState } from 'react'
import { useEditorString } from 'platejs/react'

import { cn } from '@/lib/aural-ui/utils'

import { Button } from '../aural-ui/button'
import { Editor } from './editor'

const CommentValue = ({
	commentText,
	isEditing,
	onEditorClick,
	onCancel,
	onSave,
}: {
	commentText: string
	isEditing?: boolean
	onCancel: () => void
	onEditorClick?: () => void
	onSave: () => void
}) => {
	const editorString = useEditorString()
	const isUnchanged = commentText === editorString

	const [hasFocus, setHasFocus] = useState(false)

	return (
		<div
			className={cn(
				'rounded-fm-s bg-fm-surface-frosted/20 leading-fm-md border-fm-divider-secondary relative mt-1 w-full border border-solid [font-size:var(--text-fm-md)] transition-all duration-200',
				{
					'border-fm-divider-contrast': hasFocus,
				}
			)}
		>
			<Editor
				variant="comment"
				className={cn(
					'placeholder:text-fm-placeholder font-fm-text text-fm-primary leading-fm-md block min-h-[25px] w-full grow border-none px-4 py-2 [font-size:var(--text-fm-md)] tracking-wide ring-offset-transparent focus:outline-none',
					{
						'text-fm-primary': isEditing,
					}
				)}
				onFocus={() => setHasFocus(true)}
				onBlur={() => setHasFocus(false)}
				onClick={() => onEditorClick?.()}
			/>

			{isEditing && (
				<div className="border-fm-divider-secondary mx-2 mt-2 flex items-center justify-end gap-1 border-t pr-2">
					<Button
						variant="text"
						className="text-fm-primary"
						innerClassName="translate-none"
						size="sm"
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.stopPropagation()
							void onCancel()
						}}
					>
						Cancel
					</Button>

					<Button
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.stopPropagation()
							void onSave()
						}}
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
			)}
		</div>
	)
}

export default CommentValue
