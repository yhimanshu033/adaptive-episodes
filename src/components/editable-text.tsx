'use client'

import React, { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { LucideComponent } from '@/types/common'

const EditableText = ({
	text: defaultText = '',
	onComplete,
	inputClass,
	isEditable,
	textClass,
	rootClass,
	icon: Icon,
}: {
	icon?: LucideComponent
	inputClass?: string
	isEditable?: boolean
	onComplete?: (text: string) => void
	rootClass?: string
	text: string
	textClass?: string
}) => {
	const ref = useRef(null)
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(defaultText)

	const handleComplete = () => {
		setIsEditing(false)
		onComplete?.(text || defaultText)
		if (!text) setText(defaultText)
	}

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleComplete()
	}

	useOnClickOutside(ref, handleComplete)

	const handleTextClick = () => {
		if (!isEditable) return
		setIsEditing(true)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value)
	}

	const handleCross = () => {
		setText(defaultText)
		setIsEditing(false)
	}

	return (
		<div className={cn('relative flex items-center', rootClass)}>
			{isEditing ? (
				<form onSubmit={onSubmit} ref={ref}>
					<div className="flex items-center">
						<Input
							type="text"
							value={text}
							onChange={handleInputChange}
							autoFocus
							className={cn('mr-2', inputClass)}
						/>
						<Button type="submit" variant="ghost" size="icon">
							<Check size={16} />
						</Button>
						<Button variant="ghost" size="icon" onClick={handleCross}>
							<X size={16} />
						</Button>
					</div>
				</form>
			) : (
				<p
					onClick={handleTextClick}
					className={cn('item-center flex', textClass)}
					title={text}
				>
					{text}
					{Icon && <Icon strokeWidth={3} className="ml-3" />}
				</p>
			)}
		</div>
	)
}

export default EditableText
