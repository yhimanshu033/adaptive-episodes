'use client'

import React from 'react'
import Image from 'next/image'
import { seriesData } from '@/constants/landing-constants'
import { motion } from 'framer-motion'

import Marquee from '@/components/ui/marquee'

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

const marqueeVariants = {
	hidden: {
		opacity: 0,
		y: 50,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
			delay: 0.3,
		},
	},
}

const cardVariants = {
	hidden: {
		opacity: 0,
		scale: 0.9,
		y: 20,
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
}

const SeriesShowcase = () => {
	const SeriesCard = ({
		series,
		index,
	}: {
		index: number
		series: (typeof seriesData)[0]
	}) => (
		<motion.div
			className="carousel-item w-[150px] min-w-[140px] px-1 sm:w-[250px] sm:min-w-[180px] sm:px-2 md:w-[350px] md:min-w-[220px]"
			variants={cardVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{
				scale: 1.05,
				y: -10,
				transition: { duration: 0.3 },
			}}
		>
			<motion.div
				className="relative overflow-hidden rounded transition-all duration-300"
				whileHover={{
					boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
					transition: { duration: 0.3 },
				}}
			>
				<motion.div
					whileHover={{
						scale: 1.1,
						transition: { duration: 0.4 },
					}}
				>
					<Image
						src={series.image}
						alt={series.title}
						width={220}
						height={330}
						className="h-auto w-full rounded object-cover"
						priority
					/>
				</motion.div>
				<motion.div
					className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300"
					whileHover={{ opacity: 1 }}
				/>
			</motion.div>
			<motion.div
				className="mt-1 sm:mt-2"
				whileHover={{ y: -2, transition: { duration: 0.2 } }}
			>
				<h4 className="text-fm-tertiary sm:text-fm-2xl line-clamp-2 text-lg text-ellipsis">
					{series.title}
				</h4>
				<p className="text-fm-tertiary font-display text-sm sm:text-base">
					<span className="text-fm-secondary">{series.plays}</span> PLAYS
				</p>
			</motion.div>
		</motion.div>
	)

	return (
		<section id="creations" className="mt-20 overflow-hidden sm:mt-40">
			<div className="container mx-auto mb-8 not-sm:px-4 sm:mb-12">
				<motion.h2
					className="font-display sm:text-fm-4xl md:text-fm-7xl mb-4 text-2xl sm:mb-6"
					variants={headingVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					Series created with Copilot. <br />
					Call it a hit-machine.
				</motion.h2>
			</div>

			<motion.div
				className="relative w-full"
				variants={marqueeVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
			>
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-[10%] bg-gradient-to-r from-20% to-transparent sm:w-[15%]" />
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%] bg-gradient-to-l from-20% to-transparent sm:w-[15%]" />

				<Marquee direction="left" speed={20} className="py-4">
					{[...seriesData, ...seriesData].map((series, index) => (
						<SeriesCard key={`group-${index}`} series={series} index={index} />
					))}
				</Marquee>
			</motion.div>
		</section>
	)
}

export default SeriesShowcase
