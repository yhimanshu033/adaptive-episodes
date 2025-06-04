import React from 'react'
import Image from 'next/image'
import { seriesData } from '@/constants/landing-constants'

import Marquee from '@/components/ui/marquee'

const SeriesShowcase = () => {
	const SeriesCard = ({ series }: { series: (typeof seriesData)[0] }) => (
		<div className="carousel-item w-[150px] min-w-[140px] px-1 sm:w-[250px] sm:min-w-[180px] sm:px-2 md:w-[350px] md:min-w-[220px]">
			<div className="transition-all duration-300">
				<Image
					src={series.image}
					alt={series.title}
					width={220}
					height={330}
					className="h-auto w-full rounded object-cover"
				/>
			</div>
			<div className="mt-1 sm:mt-2">
				<h4 className="text-fm-tertiary sm:text-fm-2xl line-clamp-2 text-lg">
					{series.title}
				</h4>
				<p className="text-fm-tertiary font-display text-sm sm:text-base">
					<span className="text-fm-secondary">{series.plays}</span> PLAYS
				</p>
			</div>
		</div>
	)

	return (
		<section id="creations" className="mt-20 overflow-hidden sm:mt-40">
			<div className="container mx-auto mb-8 not-sm:px-4 sm:mb-12">
				<h2 className="font-display sm:text-fm-4xl md:text-fm-7xl mb-4 text-2xl sm:mb-6">
					Series created with Copilot. <br />
					Call it a hit-machine.
				</h2>
			</div>

			<div className="relative w-full">
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-[10%] bg-gradient-to-r from-20% to-transparent sm:w-[15%]" />
				<div className="from-fm-surface-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%] bg-gradient-to-l from-20% to-transparent sm:w-[15%]" />

				<Marquee direction="left" speed={20} className="py-4">
					{[...seriesData, ...seriesData].map((series, index) => (
						<SeriesCard key={`group-${index}`} series={series} />
					))}
				</Marquee>
			</div>
		</section>
	)
}

export default SeriesShowcase
