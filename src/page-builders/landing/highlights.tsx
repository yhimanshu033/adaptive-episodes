import React from 'react'
import Image from 'next/image'
import { highlightedFeatures } from '@/constants/landing-constants'

export default function HighlightSection() {
	return (
		<section id="essentials" className="mt-40 px-4 sm:px-0">
			<h2 className="font-display text-fm-2xl sm:text-fm-4xl md:text-fm-7xl relative z-10 mb-8 sm:mb-12">
				Tell stories. Like nobody else.
			</h2>

			<div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-10">
				{highlightedFeatures.map((item, index) => (
					<article key={index} className="flex flex-col">
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
					</article>
				))}
			</div>
		</section>
	)
}
