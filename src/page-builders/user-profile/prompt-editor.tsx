'use client'

import React, { useEffect, useState } from 'react'
import { QUICK_PROMPTS } from '@/constants/ai-constants'
import usePromptEditorStore from '@/store/prompt-editor-store'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import Label from '@/components/aural-ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import TextArea from '@/components/aural-ui/textarea'

const promptTypes = [
	{ value: 'Stylize', label: 'Laser Tools: Stylize' },
	{ value: 'Expand', label: 'Laser Tools: Expand' },
	{ value: 'Shorten', label: 'Laser Tools: Shorten' },
	...QUICK_PROMPTS.map(({ text }) => ({
		value: text,
		label: text.slice(0, 50) + '...',
	})),
]

const PromptEditor = () => {
	const { isFormOpen, setFormOpen } = usePromptEditorStore()
	const [selectedType, setSelectedType] = useState(promptTypes[0].value)
	const [promptText, setPromptText] = useState(selectedType)

	useEffect(() => {
		return () => {
			document.body.style.pointerEvents = ''
		}
	}, [isFormOpen])

	return (
		<Dialog open={isFormOpen} onOpenChange={setFormOpen}>
			<DialogContent
				className="h-[85vh] w-[90vw] px-6 py-8 max-sm:w-[100vw]"
				noise="none"
			>
				<DialogTitle>Edit prompts across editor</DialogTitle>
				<DialogDescription className="sr-only">
					Edit prompt across editor
				</DialogDescription>
				<Divider variant="dashed" />
				<div className="flex h-full flex-col gap-4 overflow-auto">
					<div className="space-y-8">
						<div className="space-y-3">
							<Label>Prompts</Label>
							<Select
								value={selectedType}
								onValueChange={(val) => {
									const selected = promptTypes.find(
										(type) => type.value === val
									)
									if (selected) {
										setSelectedType(selected.value)
										setPromptText(selected.value)
									}
								}}
							>
								<SelectTrigger decoration="outline">
									<SelectValue placeholder="Select prompt type" />
								</SelectTrigger>
								<SelectContent className="z-50">
									{promptTypes.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-3">
							<Label>Enter change</Label>
							<TextArea
								placeholder="Enter your prompt here"
								value={promptText}
								onChange={(e) => setPromptText(e.target.value)}
								autoGrow={false}
								rows={8}
							/>
						</div>
					</div>
				</div>
				<div className="flex grow items-end">
					<Button isDisabled className="w-full">
						Save & Continue
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default PromptEditor
