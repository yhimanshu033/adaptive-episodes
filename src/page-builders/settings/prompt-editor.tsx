'use client'

import React, { useState } from 'react'
import { QUICK_PROMPTS } from '@/constants/ai-constants'
import { RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const promptTypes = [
	{ value: 'Stylize', label: 'Laser Tools: Stylize' },
	{ value: 'Expand', label: 'Laser Tools: Expand' },
	{ value: 'Shorten', label: 'Laser Tools: Shorten' },
	...QUICK_PROMPTS.map((prompt) => ({
		value: prompt,
		label: prompt.slice(0, 50) + '...',
	})),
]

export function PromptEditor() {
	const [selectedType, setSelectedType] = useState(promptTypes[0].value)
	const [promptText, setPromptText] = useState(selectedType)

	const handleSave = () => {}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Edit Prompts</h3>
			<Select
				value={selectedType}
				onValueChange={(val) => {
					const selected = promptTypes.find((type) => type.value === val)
					if (selected) {
						setSelectedType(selected.value)
						setPromptText(selected.value)
					}
				}}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select prompt type" />
				</SelectTrigger>
				<SelectContent>
					{promptTypes.map((type) => (
						<SelectItem key={type.value} value={type.value}>
							{type.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Textarea
				placeholder="Enter your prompt here"
				value={promptText}
				onChange={(e) => setPromptText(e.target.value)}
				className="min-h-[100px]"
			/>
			<div className="flex justify-between">
				<Button
					onClick={handleSave}
					disabled
					variant="outline"
					className="flex gap-2"
				>
					Reset Prompt{' '}
					<span>
						<RotateCcw size={16} />{' '}
					</span>
				</Button>
				<Button
					onClick={handleSave}
					disabled
					variant="outline"
					className="flex gap-2"
				>
					Save Prompt{' '}
					<span>
						<Save size={16} />{' '}
					</span>
				</Button>
			</div>
		</div>
	)
}
