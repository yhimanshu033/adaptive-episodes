'use client'

import React, { useEffect, useRef, useState } from 'react'

import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

interface EditableTextProps {
	className?: string
	multiline?: boolean
	onChange: (value: string) => void
	placeholder?: string
	value: string
}

export default function EditableText({
	value,
	onChange,
	className,
	placeholder = 'Click to edit',
	multiline = false,
}: EditableTextProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(value)
	const inputRef = useRef<HTMLInputElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		setEditValue(value)
	}, [value])

	useEffect(() => {
		if (isEditing) {
			if (multiline && textareaRef.current) {
				setTimeout(() => {
					textareaRef.current?.focus()
					textareaRef.current?.select()
				}, 0)
			} else if (!multiline && inputRef.current) {
				setTimeout(() => {
					inputRef.current?.focus()
					inputRef.current?.select()
				}, 0)
			}
		}
	}, [isEditing, multiline])

	const handleClick = () => {
		setIsEditing(true)
	}

	const handleBlur = () => {
		if (editValue !== value) {
			onChange(editValue)
		}
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !multiline) {
			e.preventDefault()
			handleBlur()
		} else if (e.key === 'Escape') {
			setEditValue(value)
			setIsEditing(false)
		}
	}

	if (isEditing) {
		if (multiline) {
			return (
				<TextArea
					ref={textareaRef}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					decoration="outline"
					autoGrow
					minHeight={60}
					className={className}
				/>
			)
		}

		return (
			<input
				ref={inputRef}
				type="text"
				value={editValue}
				onChange={(e) => setEditValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={cn(
					'border-fm-divider-primary focus:border-fm-divider-contrast w-full border-b bg-transparent outline-none',
					className
				)}
			/>
		)
	}

	return (
		<span
			onClick={handleClick}
			className={cn(
				'hover:bg-fm-surface-secondary inline-block cursor-pointer rounded px-2 py-1',
				className
			)}
		>
			{value || <span className="text-fm-tertiary italic">{placeholder}</span>}
		</span>
	)
}
