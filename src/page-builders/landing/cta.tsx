'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CTA_BG_URL } from '@/constants/landing-constants'
import { motion } from 'framer-motion'

import { Button } from '@/components/aural-ui/button'

const backgroundVariants = {
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
		},
	},
}

const headingVariants = {
	hidden: {
		opacity: 0,
		y: 30,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
			delay: 0.3,
		},
	},
}

const buttonVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.9,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
			delay: 0.5,
		},
	},
}

const footerVariants = {
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
			delay: 0.7,
		},
	},
}

export default function CTA() {
	return (
		<section className="mt-16 sm:mt-20">
			<div className="relative overflow-hidden py-8 sm:py-10">
				<motion.div
					className="absolute inset-0"
					variants={backgroundVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					<Image
						src={CTA_BG_URL}
						alt="CTA Background"
						fill
						className="w-full object-cover object-center"
					/>
					<div className="absolute inset-0 bg-black/20" />
				</motion.div>
				<div className="relative z-10 container not-sm:px-4">
					<motion.h2
						className="sm:text-fm-2xl md:text-fm-4xl mb-6 text-xl font-medium text-white sm:mb-8"
						variants={headingVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						Ready to write fast, smart, and
						<br className="hidden sm:block" /> reach a global audience?
					</motion.h2>

					<motion.div
						variants={buttonVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						<Button
							variant="outline"
							size="lg"
							innerClassName="text-fm-neutral-50 bg-white w-full sm:w-54 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:scale-105"
						>
							<Link href="/projects">Get started</Link>
						</Button>
					</motion.div>
				</div>
			</div>
			<motion.footer
				className="text-fm-sm text-fm-tertiary p-4 text-center sm:p-6"
				variants={footerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.5 }}
			>
				&copy; 2025 Pocket CoPilot. All rights reserved
			</motion.footer>
		</section>
	)
}
