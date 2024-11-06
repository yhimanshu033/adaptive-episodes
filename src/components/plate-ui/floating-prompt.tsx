import React, { useCallback, useEffect, useMemo } from 'react'
import useLaserStore, { setLaser } from '@/store/laser-store'
import { nanoid } from 'nanoid'

export default function FloatingPrompt() {
	const { active: activeLaser, lasers: allLasers } = useLaserStore()
	const laser = activeLaser ? allLasers[activeLaser] : null

	const setVal = useCallback(
		(val: string) => {
			if (!activeLaser || !laser) return
			setLaser({ id: activeLaser, laser: { ...laser, prompt: val } })
		},
		[activeLaser, laser]
	)

	const val = laser?.prompt || ''

	const inputRef = React.useRef<HTMLInputElement>(null)

	useEffect(() => {
		const caret = inputRef.current?.selectionStart
		if (!caret || !activeLaser || !laser) return
		setLaser({
			id: activeLaser,
			laser: { ...laser, caretPos: inputRef.current?.selectionEnd || caret },
		})
	}, [
		inputRef.current?.selectionStart,
		activeLaser,
		inputRef.current?.selectionEnd,
	])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!activeLaser || !laser) return
		if (e.key === 'ArrowLeft') {
			setLaser({
				id: activeLaser,
				laser: {
					...laser,
					caretPos: Math.max((inputRef.current?.selectionStart || 0) - 1, 0),
					caretEnd: Math.max((inputRef.current?.selectionStart || 0) - 1, 0),
				},
			})
		} else if (e.key === 'ArrowRight') {
			setLaser({
				id: activeLaser,
				laser: {
					...laser,
					caretPos: Math.min(
						(inputRef.current?.selectionStart || 0) + 1,
						inputRef.current?.value.length || 0
					),
					caretEnd: Math.min(
						(inputRef.current?.selectionStart || 0) + 1,
						inputRef.current?.value.length || 0
					),
				},
			})
		}
	}

	const name = useMemo(() => nanoid(), [activeLaser])

	return (
		<input
			name={name}
			autoComplete="off"
			onKeyDown={handleKeyDown}
			ref={inputRef}
			value={val}
			className="absolute right-0 top-0 w-0 bg-red-500 opacity-0"
			onChange={(e) => setVal(e.target.value)}
			id="prompt-input"
		/>
	)
}
