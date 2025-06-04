import React from 'react'
import Image from 'next/image'
import { LOCALIZATION_IMAGE_URL } from '@/constants/landing-constants'
import { ArrowRightLeft } from 'lucide-react'

const LocalizationSection = () => {
	return (
		<section className="mt-40">
			<div className="relative z-10 space-y-2">
				<h2 className="text-fm-4xl md:text-fm-7xl font-display text-center">
					Don’t just translate. Adapt.
				</h2>
				<p className="text-fm-lg md:text-fm-xl text-fm-secondary mx-auto text-center">
					Copilot brings true local flavour to your story. Names, foods, places,
					even expressions — everything adapts <br /> to fit the culture,
					naturally.
				</p>
			</div>
			<div className="relative h-[853px] w-full -translate-y-[18%] overflow-hidden">
				<Image
					src={LOCALIZATION_IMAGE_URL}
					alt="Localization"
					fill
					className="object-cover object-center"
					priority
				/>
				<div className="absolute bottom-[6%] left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center gap-3 text-center md:flex-row">
					<div className="bg-fm-surface-contrast text-fm-contrast px-2 py-4 text-xl font-medium shadow">
						Peter eats a cheese burger in a New York diner
					</div>
					<ArrowRightLeft strokeWidth={1} size={36} />
					<div className="bg-fm-hotpink-50 text-fm-divider-brand-secondary px-2 py-4 text-xl">
						“André enjoys a panini at a café in Paris”
					</div>
				</div>
			</div>
		</section>
	)
}

export default LocalizationSection
