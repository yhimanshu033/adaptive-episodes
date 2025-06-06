'use client'

import React from 'react'
import Image from 'next/image'
import {
	EDITOR_PREVIEW_URL,
	GLITTER_EFFECT_URL,
} from '@/constants/landing-constants'
import { motion } from 'framer-motion'

const glitterVariants = {
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
			duration: 1.2,
			ease: 'easeOut',
			delay: 0.3,
		},
	},
}

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

const editorVariants = {
	hidden: {
		opacity: 0,
		y: 50,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
			delay: 0.2,
		},
	},
}

export default function EditorPreviewSection() {
	return (
		<section className="mt-20 sm:mt-40">
			<div className="relative">
				<motion.div
					className="absolute top-1/2 left-1/2 h-32 w-40 -translate-x-1/2 -translate-y-1/4 overflow-hidden sm:h-44 sm:w-56"
					variants={glitterVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					<Image
						src={GLITTER_EFFECT_URL}
						alt="Effect"
						fill
						className="object-none object-center"
					/>
				</motion.div>
				<motion.h2
					className="font-display md:text-fm-7xl text-fm-2xl sm:text-fm-4xl relative z-10 mb-8 sm:mb-16 sm:text-center"
					variants={headingVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					Write it right. Edit it tight.
				</motion.h2>
			</div>
			<motion.div
				className="border-fm-primary/5 relative z-10 mx-auto rounded-lg border-4 sm:border-8"
				variants={editorVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
			>
				<Image
					src={EDITOR_PREVIEW_URL}
					alt="Editor preview"
					width={1200}
					height={600}
					className="h-auto w-full rounded"
					priority
				/>
				<div className="from-fm-surface-primary pointer-events-none absolute -inset-x-1 -bottom-1 h-[40%] bg-linear-to-t from-30% to-transparent sm:-inset-x-2 sm:-bottom-2" />
			</motion.div>
		</section>
	)
}
