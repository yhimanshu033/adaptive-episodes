import React, { useCallback, useMemo, useState } from 'react'
import ChevronRightIcon from '@/icons/chevron-right-icon'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import Input from '@/components/aural-ui/input'
import TextArea from '@/components/aural-ui/textarea'
import ForEach from '@/components/ui/for-each'
import { trim } from '@/lib/utils/helpers'

import { TQuickPrompt } from '@/types/ai-types'

interface QuickPromptsProps {
	quickPrompts: TQuickPrompt[]
	setQuickPrompts: (data: TQuickPrompt[]) => void
}
export default function QuickPrompts({
	quickPrompts,
	setQuickPrompts,
}: QuickPromptsProps) {
	const [active, setActive] = useState(-1)

	if (active >= 0 && quickPrompts[active]) {
		return (
			<QuickPromptActiveCard
				item={quickPrompts[active]}
				onCancel={() => setActive(-1)}
				onSave={(data) => {
					const newPrompts = [...quickPrompts]
					newPrompts[active] = data
					setQuickPrompts(newPrompts)
					setActive(-1)
				}}
			/>
		)
	}

	return (
		<ForEach data={quickPrompts}>
			{(item, idx) => (
				<QuickPromptCard
					item={item}
					onClick={() => setActive(idx)}
					key={`config-quick-prompt-${idx}`}
				/>
			)}
		</ForEach>
	)
}

function QuickPromptCard({
	item,
	onClick,
}: {
	item: TQuickPrompt
	onClick: () => void
}) {
	return (
		<div
			onClick={onClick}
			className="border-fm-divider-secondary flex cursor-pointer items-center justify-between border-b border-dashed py-2"
		>
			<h3>{trim(item.title || '', 20)}</h3>
			<ChevronRightIcon />
		</div>
	)
}

function QuickPromptActiveCard({
	item,
	onSave,
	onCancel,
}: {
	item: TQuickPrompt
	onCancel: () => void
	onSave: (data: TQuickPrompt) => void
}) {
	const [promptData, setPromptData] = useState(item)

	const isInvalid = useMemo(() => {
		if (!promptData.text.trim().length || !promptData.title?.trim().length) {
			return true
		}
		return false
	}, [promptData])

	const handleChange = useCallback((data: Partial<TQuickPrompt>) => {
		setPromptData((prev) => {
			return {
				...prev,
				...data,
			}
		})
	}, [])

	const handleSave = useCallback(() => {
		onSave(promptData)
		toast.success(`Saved changed in the prompt: ${trim(item.title || '', 8)}`)
	}, [promptData, onSave, item.title])

	return (
		<div className="flex flex-col justify-between gap-2">
			<div className="flex flex-col gap-4">
				<Input
					label="Title"
					value={promptData.title || ''}
					onChange={(e) => handleChange({ title: e.target.value })}
				/>
				<TextArea
					minHeight={250}
					maxHeight={250}
					decoration="outline"
					className="space-y-2"
					label="Prompt"
					value={promptData.text || ''}
					onChange={(e) => handleChange({ text: e.target.value })}
				/>
			</div>
			<div className="flex items-center justify-between pt-6">
				<Button
					size="sm"
					variant="text"
					onClick={onCancel}
					innerClassName="!px-0"
				>
					Exit & Discard
				</Button>
				<Button
					size="sm"
					variant="outline"
					disabled={isInvalid}
					isDisabled={isInvalid}
					onClick={handleSave}
				>
					Save
				</Button>
			</div>
		</div>
	)
}
