'use client'

import React from 'react'
import { faqItems } from '@/constants/landing-constants'
import { motion } from 'framer-motion'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleHeader,
} from '@/components/aural-ui/collapsible'

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

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
}

const faqItemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.98,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
}

export default function FAQ() {
	return (
		<section id="faq" className="relative mt-20 w-full sm:mt-40">
			<div className="container not-sm:px-4">
				<motion.h2
					className="font-display sm:text-fm-4xl md:text-fm-7xl mb-8 text-2xl sm:mb-12"
					variants={headingVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					Frequently asked questions
				</motion.h2>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{faqItems.map((item, index) => (
						<motion.div
							key={index}
							variants={faqItemVariants}
							whileHover={{
								scale: 1.01,
								transition: { duration: 0.2 },
							}}
						>
							<Collapsible>
								<motion.div
									whileHover={{
										x: 5,
										transition: { duration: 0.2 },
									}}
								>
									<CollapsibleHeader
										className="pt-4 pb-3 sm:pt-6 sm:pb-4 [&_.collapsible-title]:text-lg [&_.collapsible-title]:md:text-2xl [&_.collapsible-title]:lg:text-3xl"
										title={item.question}
									/>
								</motion.div>
								<CollapsibleContent>
									<motion.p
										className="text-fm-md md:text-fm-lg"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.3,
											ease: 'easeOut',
											delay: 0.1,
										}}
									>
										{item.answer}
									</motion.p>
								</CollapsibleContent>
							</Collapsible>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
