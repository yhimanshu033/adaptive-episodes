'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { slides } from '@/constants/landing-constants'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils/helpers'

const headingVariants = {
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
		},
	},
}

const listContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
}

const listItemVariants = {
	hidden: {
		opacity: 0,
		x: -30,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
}

const imageContainerVariants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
		x: 50,
	},
	visible: {
		opacity: 1,
		scale: 1,
		x: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
			delay: 0.4,
		},
	},
}

const imageVariants = {
	hidden: {
		opacity: 0,
		scale: 1.05,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.3,
			ease: 'easeIn',
		},
	},
}

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
					<motion.h2
						className="font-display sm:text-fm-4xl md:text-fm-7xl mb-6 text-2xl sm:mb-8 sm:text-3xl"
						variants={headingVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						Create faster, better.
						<br /> With essential tools.
					</motion.h2>
					<motion.ul
						className="space-y-4 sm:space-y-6"
						variants={listContainerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						{slides.map((slide, index) => (
							<motion.li
								key={index}
								className={cn(
									'cursor-pointer transition-all duration-300',
									index === activeIndex
										? 'text-fm-primary'
										: 'text-fm-tertiary hover:text-fm-primary'
								)}
								onClick={() => handleClick(index)}
								variants={listItemVariants}
							>
								<motion.h3
									className={cn(
										index === activeIndex ? 'text-fm-primary' : 'text-inherit',
										'sm:text-fm-2xl text-lg'
									)}
								>
									{slide.title}
								</motion.h3>
								<p
									className={cn(
										'sm:text-fm-md line-clamp-3 text-sm sm:line-clamp-none',
										{
											'text-fm-placeholder': index !== activeIndex,
											'text-fm-secondary': index === activeIndex,
										}
									)}
								>
									{slide.description}
								</p>
							</motion.li>
						))}
					</motion.ul>
				</div>
				<motion.div
					className="flex h-full justify-center sm:justify-end"
					variants={imageContainerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					<div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80 md:h-full md:w-[85%]">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeIndex}
								className="absolute inset-0"
								variants={imageVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<Image
									src={slides[activeIndex].image}
									alt={slides[activeIndex].title}
									fill
									className="object-cover object-center"
									unoptimized
								/>
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
