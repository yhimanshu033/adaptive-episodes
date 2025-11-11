'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Progress } from '@/components/ui/progress'

interface ProgressLoadingProps {
	// e.g. 95 means stop at 95%
	className?: string
	persistKey?: string
	reset?: boolean
	// total time in ms for 0→100
	stop?: boolean
	stopAt?: number
	time?: number
}

export const ProgressLoading = ({
	time = 3000,
	stop = false,
	reset = false,
	stopAt = 100,
	className,
	persistKey = 'progress-loading',
}: ProgressLoadingProps) => {
	const [progress, setProgress] = useState(0)
	const startRef = useRef<number | null>(null)
	const pausedAtRef = useRef<number | null>(null)
	const rafRef = useRef<number | null>(null)

	// 🕐 Initialize from sessionStorage
	useEffect(() => {
		const storedStart = sessionStorage.getItem(persistKey)
		if (storedStart) {
			startRef.current = Number(storedStart)
		}
	}, [persistKey])

	// ♻️ Reset logic
	useEffect(() => {
		if (reset) {
			startRef.current = null
			pausedAtRef.current = null
			sessionStorage.removeItem(persistKey)
			setProgress(0)
		}
	}, [reset, persistKey])

	useEffect(() => {
		if (stop || progress >= stopAt) {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current)
			}
			// store paused time for resume
			if (stop && startRef.current) {
				pausedAtRef.current = Date.now() - startRef.current
			}
			return
		}

		// start or resume
		if (!startRef.current) {
			const now = Date.now() - (pausedAtRef.current ?? 0)
			startRef.current = now
			sessionStorage.setItem(persistKey, String(now))
		}

		const update = () => {
			if (!startRef.current) {
				return
			}
			const elapsed = Date.now() - startRef.current
			const next = Math.min((elapsed / time) * 100, stopAt)
			setProgress(next)

			if (next < stopAt) {
				rafRef.current = requestAnimationFrame(update)
			}
		}

		rafRef.current = requestAnimationFrame(update)
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current)
			}
		}
	}, [time, stop, stopAt, progress, persistKey])

	return <Progress value={progress} className={className} />
}
