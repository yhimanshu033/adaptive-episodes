'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/aural-ui/utils'

type LoaderTextsProps = {
	intervalMs?: number
	texts?: string[]
} & React.ComponentProps<'div'>

export const DEFAULT_TEXTS = [
	'Warming up the creative engines…',
	'Gathering story sparks…',
	'Shaping ideas in the background…',
	'Consulting the muses…',
	'Dusting off the narrative cobwebs…',
	'Aligning plot constellations…',
	'Brewing narrative possibilities…',
	'Letting characters wander onto the page…',
	'Tracing the outlines of new worlds…',
	'Stirring plot threads together…',
	'Listening for whispers of story beginnings…',
	'Setting the stage behind the scenes…',
	'Knocking on the door of inspiration…',
	'Sifting through imaginative stardust…',
	'Sketching the bones of a new narrative…',
	'Letting ideas percolate naturally…',
	'Fetching fresh story ingredients…',
	'Inviting themes to take their places…',
	'Nudging creativity awake…',
	'Gathering momentum for the next chapter…',
]

export function LoaderTexts({
	texts,
	intervalMs = 5000,
	...props
}: LoaderTextsProps) {
	const messages = useMemo(
		() => (texts?.length ? texts : DEFAULT_TEXTS),
		[texts]
	)
	const [current, setCurrent] = useState(0)

	const prevIndexRef = useRef<number | null>(null)

	useEffect(() => {
		if (messages.length <= 1) {
			return
		}

		const id = setInterval(() => {
			let nextIndex = prevIndexRef.current

			// ensure new index ≠ current index
			while (nextIndex === prevIndexRef.current) {
				nextIndex = Math.floor(Math.random() * messages.length)
			}

			prevIndexRef.current = nextIndex
			setCurrent(nextIndex ?? 0)
		}, intervalMs)

		return () => clearInterval(id)
	}, [messages, intervalMs])

	// Initialize first index
	useEffect(() => {
		prevIndexRef.current = 0
	}, [])

	return (
		<div
			{...props}
			className={cn('font-fm-brand w-full text-center', props.className)}
		>
			{messages[current]}
		</div>
	)
}

export default LoaderTexts
