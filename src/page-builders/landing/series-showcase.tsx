import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { seriesData } from '@/constants/landing-constants'
import { motion, useAnimation, useInView } from 'framer-motion'

const SeriesShowcase = () => {
	const sectionRef = useRef<HTMLDivElement>(null)
	const carouselRef = useRef<HTMLDivElement>(null)
	const [itemWidth, setItemWidth] = useState(0)
	const controls = useAnimation()
	const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

	useEffect(() => {
		if (carouselRef.current) {
			const firstItem = carouselRef.current.querySelector('.carousel-item')
			if (firstItem) {
				const itemRect = firstItem.getBoundingClientRect()
				const gap = 24 // 6 * 4px (gap-6)
				setItemWidth(itemRect.width + gap)
			}
		}
	}, [])

	useEffect(() => {
		if (isInView && itemWidth > 0) {
			const totalSetWidth = itemWidth * seriesData.length

			void controls.start({
				x: [0, -totalSetWidth],
				transition: {
					x: {
						repeat: Infinity,
						repeatType: 'loop',
						duration: 30,
						ease: 'linear',
					},
				},
			})
		}
	}, [isInView, itemWidth, controls])

	return (
		<section id="creations" ref={sectionRef} className="mt-40 overflow-hidden">
			<div className="container mx-auto mb-12 px-6">
				<h2 className="font-display text-fm-4xl md:text-fm-7xl mb-6">
					Series created with Copilot. <br />
					Call it a hit-machine.
				</h2>
			</div>

			<div className="relative w-full">
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-[15%] bg-gradient-to-r from-20% to-transparent" />
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-[15%] bg-gradient-to-l from-20% to-transparent" />

				<div className="overflow-hidden">
					<motion.div
						ref={carouselRef}
						animate={controls}
						className="container flex gap-2"
					>
						{Array.from({ length: 4 }, (_, setIndex) =>
							seriesData.map((series, index) => (
								<motion.div
									key={`${setIndex}-${index}`}
									className="carousel-item min-w-[180px] flex-shrink-0 md:min-w-[220px]"
									transition={{ duration: 0.3 }}
								>
									<div className="p-1 transition-all duration-300">
										<Image
											// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
											src={Object.values(series.image)[0]}
											alt={series.title}
											width={220}
											height={330}
											className="h-auto w-full rounded object-cover"
										/>
									</div>
									<div className="text-fm-xl mt-2">
										<h4 className="text-fm-2xl text-fm-tertiary">
											{series.title}
										</h4>
										<p className="text-fm-tertiary font-display">
											<span className="text-fm-secondary">{series.plays}</span>{' '}
											PLAYS
										</p>
									</div>
								</motion.div>
							))
						)}
					</motion.div>
				</div>
			</div>
		</section>
	)
}

export default SeriesShowcase
