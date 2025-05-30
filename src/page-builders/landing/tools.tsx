'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
	TOOL_1_URL,
	TOOL_2_URL,
	TOOL_3_URL,
} from '@/constants/landing-constants'

import { cn } from '@/lib/utils/helpers'

const slides = [
	{
		image: TOOL_1_URL,
		title: 'Collaboration',
		description:
			'Build your own dream team of writers, editors, and friends and create series in real time.',
	},
	{
		image: TOOL_2_URL,
		title: 'Story explorer',
		description:
			'Get a clear overview of your story anytime —characters, arcs, locations, and more. Think of it as an easy-to-use cheatsheet.',
	},
	{
		image: TOOL_3_URL,
		title: 'Create modes',
		description:
			'Toggle between writing mode and preview mode to build and review your work with ease.',
	},
]

export default function ToolsSection() {
	const [activeIndex, setActiveIndex] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const startSlideshow = () => {
		intervalRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % slides.length)
		}, 5000)
	}

	const resetSlideshow = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
		}
		startSlideshow()
	}

	const handleClick = (index: number) => {
		setActiveIndex(index)
		resetSlideshow()
	}

	useEffect(() => {
		startSlideshow()
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [])

	return (
		<div className="from-fm-neutral-300/25 to-fm-surface-primary/0 relative w-full bg-linear-to-r to-50% py-10">
			<div className="container mx-auto grid grid-cols-1 items-center gap-8 md:grid-cols-2">
				<div>
					<h2 className="text-fm-4xl font-display md:text-fm-7xl mb-8 font-semibold">
						Create faster, better.
						<br /> With essential tools.
					</h2>
					<ul className="space-y-6">
						{slides.map((slide, index) => (
							<li
								key={index}
								className={cn(
									'cursor-pointer transition-all duration-300',
									index === activeIndex
										? 'text-fm-primary'
										: 'text-fm-tertiary hover:text-fm-primary'
								)}
								onClick={() => handleClick(index)}
							>
								<h3
									className={cn(
										index === activeIndex ? 'text-fm-primary' : 'text-inherit',
										'text-fm-2xl'
									)}
								>
									{slide.title}
								</h3>
								<p className="text-fm-md text-fm-placeholder">
									{slide.description}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="flex h-full justify-end">
					<div className="relative h-full w-[85%]">
						<Image
							src={slides[activeIndex].image}
							alt={slides[activeIndex].title}
							fill
							className="robject-cover object-center transition-opacity duration-500"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
