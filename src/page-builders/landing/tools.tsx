'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { slides } from '@/constants/landing-constants'

import { cn } from '@/lib/utils/helpers'

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
		<section className="from-fm-neutral-300/25 to-fm-surface-primary/0 relative w-full bg-linear-to-r to-50% py-8 sm:py-10">
			<div className="container mx-auto grid grid-cols-1 items-center gap-6 not-sm:px-4 sm:gap-8 md:grid-cols-2">
				<div>
					<h2 className="font-display sm:text-fm-4xl md:text-fm-7xl mb-6 text-2xl sm:mb-8 sm:text-3xl">
						Create faster, better.
						<br /> With essential tools.
					</h2>
					<ul className="space-y-4 sm:space-y-6">
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
										'sm:text-fm-2xl text-lg'
									)}
								>
									{slide.title}
								</h3>
								<p className="text-fm-placeholder sm:text-fm-md line-clamp-3 text-sm sm:line-clamp-none">
									{slide.description}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="flex h-full justify-center sm:justify-end">
					<div className="relative h-64 w-full sm:h-80 md:h-full md:w-[85%]">
						<Image
							src={slides[activeIndex].image}
							alt={slides[activeIndex].title}
							fill
							className="object-cover object-center transition-opacity duration-500"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
