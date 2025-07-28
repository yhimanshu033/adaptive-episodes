'use client'

import React from 'react'
import Image from 'next/image'
import { LOCALIZATION_IMAGE_URL } from '@/constants/landing-constants'
import { motion } from 'framer-motion'
import { ArrowRightLeft } from 'lucide-react'

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

const descriptionVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
			delay: 0.2,
		},
	},
}

const imageVariants = {
	hidden: {
		opacity: 0,
		scale: 1.1,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 1.2,
			ease: 'easeOut',
			delay: 0.3,
		},
	},
}

const translationContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
}

const originalTextVariants = {
	hidden: {
		opacity: 0,
		x: -50,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
}

const arrowVariants = {
	hidden: {
		opacity: 0,
		scale: 0.5,
		rotate: -180,
	},
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
		},
	},
}

const translatedTextVariants = {
	hidden: {
		opacity: 0,
		x: 50,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
}

const LocalizationSection = () => {
	return (
		<section className="mt-20 overflow-hidden sm:mt-40">
			<div className="relative z-10 container space-y-2 not-sm:px-4 sm:space-y-4">
				<motion.h2
					className="sm:text-fm-4xl md:text-fm-7xl font-display text-3xl sm:text-center"
					variants={headingVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					Don&apos;t just translate. Adapt.
				</motion.h2>
				<motion.p
					className="sm:text-fm-lg md:text-fm-xl text-fm-secondary mx-auto max-w-lg text-sm sm:max-w-none sm:text-center"
					variants={descriptionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					Copilot brings true local flavour to your story. Names, foods, places,
					even expressions — everything adapts to fit the culture, naturally.
				</motion.p>
			</div>
			<div className="relative pb-20 sm:pb-0">
				<motion.div
					variants={imageVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					<Image
						src={LOCALIZATION_IMAGE_URL}
						alt="Localization"
						width={1440}
						height={863}
						className="h-auto w-auto"
						priority
					/>
				</motion.div>
				<motion.div
					className="absolute bottom-[6%] left-1/2 flex w-full max-w-xs -translate-x-1/2 flex-col items-center justify-center gap-2 px-2 text-center sm:max-w-none sm:gap-3 sm:px-0 md:flex-row"
					variants={translationContainerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					<motion.div
						className="bg-fm-surface-contrast text-fm-contrast text-fm-sm sm:text-fm-lg px-2 py-1 font-medium shadow sm:px-2 sm:py-4 md:text-xl"
						variants={originalTextVariants}
					>
						Peter eats a cheese burger in a New York diner
					</motion.div>
					<motion.div variants={arrowVariants}>
						<ArrowRightLeft
							strokeWidth={1}
							className="size-4 rotate-90 sm:size-9 md:rotate-0"
						/>
					</motion.div>
					<motion.div
						className="bg-fm-hotpink-50 text-fm-divider-brand-secondary text-fm-sm sm:text-fm-lg md:text-fm-xl px-2 py-1 sm:px-2 sm:py-4"
						variants={translatedTextVariants}
					>
						&ldquo;André enjoys a panini at a café in Paris&rdquo;
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

export default LocalizationSection
