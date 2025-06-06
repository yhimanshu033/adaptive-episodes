import React from 'react'
import Image from 'next/image'
import { highlightedFeatures } from '@/constants/landing-constants'
import { motion } from 'framer-motion'

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
		},
	},
}

const itemVariants = {
	hidden: {
		opacity: 0.01,
		y: 50,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
}

const headingVariants = {
	hidden: {
		opacity: 0.01,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 1,
			ease: 'easeOut',
		},
	},
}

export default function HighlightSection() {
	return (
		<section id="essentials" className="mt-16 sm:mt-40">
			<motion.h2
				className="font-display text-fm-2xl sm:text-fm-4xl md:text-fm-7xl relative z-10 mb-8 sm:mb-12"
				variants={headingVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				Tell stories. Like nobody else.
			</motion.h2>

			<motion.div
				className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-10"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
			>
				{highlightedFeatures.map((item, index) => (
					<motion.article
						key={index}
						className="flex flex-col"
						variants={itemVariants}
					>
						<div className="relative h-48 w-full overflow-hidden border-2 border-transparent sm:h-64">
							<Image
								src={item.image}
								alt={item.title}
								fill
								className="object-cover"
							/>
						</div>
						<h3 className="font-display text-fm-lg sm:text-fm-xl mt-3 mb-2 sm:mt-4">
							[ {item.title} ]
						</h3>
						<p className="text-fm-secondary sm:text-fm-lg line-clamp-4 text-sm">
							{item.description}
						</p>
					</motion.article>
				))}
			</motion.div>
		</section>
	)
}
