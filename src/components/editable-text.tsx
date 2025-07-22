'use client'

import React, { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/helpers'

import { LucideComponent } from '@/types/common'

export interface EditableTextProps {
	btnClass?: string
	icon?: LucideComponent
	inputClass?: string
	isEditable?: boolean
	onComplete?: (text: string) => void
	rootClass?: string
	text: string
	textClass?: string
}
const EditableText = ({
	text: defaultText = '',
	onComplete,
	inputClass,
	isEditable,
	textClass,
	btnClass,
	rootClass,
	icon: Icon,
}: EditableTextProps) => {
	const ref = useRef(null)
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(defaultText)

	const handleComplete = () => {
		setIsEditing(false)
		if (text === defaultText) {
			return
		}
		onComplete?.(text || defaultText)
		if (!text) {
			setText(defaultText)
		}
	}

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleComplete()
	}

	useOnClickOutside(ref, handleComplete)

	const handleTextClick = () => {
		if (!isEditable) {
			return
		}
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
			<IfElse condition={isEditing}>
				<If>
					<form onSubmit={onSubmit} ref={ref}>
						<div className="flex items-center">
							<Input
								type="text"
								value={text}
								onChange={handleInputChange}
								autoFocus
								className={cn('mr-2', inputClass)}
							/>
							<Button
								type="submit"
								variant="ghost"
								size="icon"
								className={btnClass}
								tooltip="Accept"
							>
								<Check size={16} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleCross}
								className={btnClass}
								tooltip="Close"
							>
								<X size={16} />
							</Button>
						</div>
					</form>
				</If>
				<Else>
					<p
						onClick={handleTextClick}
						className={cn('item-center flex', textClass)}
						title={text}
					>
						{text}
						<If condition={Icon && isEditable}>
							{Icon && <Icon strokeWidth={3} className="ml-3" />}
						</If>
					</p>
				</Else>
			</IfElse>
		</div>
	)
}

export default EditableText
