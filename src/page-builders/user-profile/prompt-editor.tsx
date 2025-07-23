'use client'

import React, { useEffect, useState } from 'react'
import { QUICK_PROMPTS } from '@/constants/ai-constants'
import { CrossIcon } from '@/icons/cross-icon'
import usePromptEditorStore from '@/store/prompt-editor-store'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
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
	const { isFormOpen, setFormOpen } = usePromptEditorStore(
		useShallow((state) => ({
			isFormOpen: state.isFormOpen,
			setFormOpen: state.setFormOpen,
		}))
	)
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
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				borderConfig={['left', 'right']}
				className="max-sm:[100vw] h-[85vh] w-[90vw] max-w-137.5 gap-5 px-0 [box-shadow:none]"
			>
				<DialogHeader className="space-y-0 px-8">
					<DialogTitle className="flex h-14 items-center justify-between gap-4">
						Edit prompts across editor
						<DialogClose
							className={iconButtonVariants({
								variant: 'ghost',
								size: 'small',
								shape: 'square',
							})}
						>
							<CrossIcon className="h-4 w-4" />
						</DialogClose>
					</DialogTitle>

					<DialogDescription className="sr-only">
						Edit prompt across editor
					</DialogDescription>

					<Divider variant="dashed" />
				</DialogHeader>

				<div className="flex h-full flex-col gap-4 overflow-auto px-8">
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
				<div className="flex grow items-end px-8">
					<Button isDisabled className="w-full">
						Save & Continue
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default PromptEditor
