import React from 'react'
import Image from 'next/image'
import { highlightedFeatures } from '@/constants/landing-constants'

export default function HighlightSection() {
	return (
		<section id="essentials">
			<h2 className="font-display relative z-10 mb-12 text-2xl md:text-5xl">
				Tell stories. Like nobody else.
			</h2>

			<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
				{highlightedFeatures.map((item, index) => (
					<article key={index} className="flex flex-col">
						<div className="relative h-64 w-full overflow-hidden border-2 border-transparent">
							<Image
								src={item.image}
								alt={item.title}
								fill
								className="object-cover"
							/>
						</div>
						<h3 className="font-display text-fm-xl mt-4 mb-2">
							[ {item.title} ]
						</h3>
						<p className="text-fm-lg text-fm-secondary max-w-sm">
							{item.description}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}
