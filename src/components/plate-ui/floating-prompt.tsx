import React, { useCallback, useMemo } from 'react'
import useLaserStore, {
	setLaser,
	setPromptActive,
	setTriggerRephrase,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ArrowLeft, Send } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Textarea } from '../ui/textarea'
import { Button } from './button'

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
	const name = useMemo(() => nanoid(), [activeLaser])

	return (
		laser && (
			<div
				onBlur={(e) => {
					if (e.currentTarget.contains(e.relatedTarget)) return
					setPromptActive(null)
				}}
				className={`absolute z-[9999] flex gap-2 bg-popover ${minify ? 'w-[35vw]' : 'w-[70vw]'} rounded-lg`}
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
						if (!val.trim()) return
						setTriggerRephrase(activeLaser)
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					<Send size={16} />
				</Button>
			</div>
		)
	)
}
