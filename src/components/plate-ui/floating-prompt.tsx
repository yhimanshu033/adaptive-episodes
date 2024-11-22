import React, { useCallback, useMemo } from 'react'
import useLaserStore, {
	setLaser,
	setPromptActive,
	setTriggerRephrase,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ArrowLeft, Send } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/plate-ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function FloatingPrompt() {
	const {
		active: activeLaser,
		lasers: allLasers,
		editorY,
		promptActive,
	} = useLaserStore()
	const laser =
		promptActive === activeLaser && promptActive
			? allLasers[promptActive]
			: null

	const { isTranslationOpen, sidebar } = usePlateStore()
	const minify = sidebar || isTranslationOpen

	const setVal = useCallback(
		(val: string) => {
			if (!activeLaser || !laser) return
			setLaser({ id: activeLaser, laser: { ...laser, prompt: val } })
		},
		[activeLaser, laser]
	)

	const val = laser?.prompt || ''

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [activeLaser])

	if (!laser) return null

	return (
		<div
			onBlur={(e) => {
				if (e.currentTarget.contains(e.relatedTarget)) return
				setPromptActive(null)
			}}
			className={cn(
				'absolute z-[9999] flex gap-2 rounded-lg bg-popover',
				minify ? 'w-[35vw]' : 'w-[70vw]'
			)}
			style={{
				top: (laser?.clientY || 0) - (editorY || 0),
				left: 48,
			}}
		>
			<Button
				variant="ghost"
				size="sm"
				className="h-24"
				onClick={() => {
					setPromptActive(null)
				}}
			>
				<ArrowLeft size={16} />
			</Button>
			<Textarea
				autoFocus
				name={name}
				autoComplete="off"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				id="prompt-input"
			/>
			<Button
				variant="default"
				size="sm"
				className="h-24"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					if (!val.trim()) return
					setTriggerRephrase(activeLaser)
				}}
			>
				<Send size={16} />
			</Button>
		</div>
	)
}
