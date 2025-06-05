import React from 'react'
import Image from 'next/image'
import { LOCALIZATION_IMAGE_URL } from '@/constants/landing-constants'
import { ArrowRightLeft } from 'lucide-react'

const LocalizationSection = () => {
	return (
		<section className="mt-20 sm:mt-40">
			<div className="relative z-10 container space-y-2 not-sm:px-4 sm:space-y-4">
				<h2 className="sm:text-fm-4xl md:text-fm-7xl font-display text-center text-2xl">
					Don&apos;t just translate. Adapt.
				</h2>
				<p className="sm:text-fm-lg md:text-fm-xl text-fm-secondary mx-auto max-w-lg text-center text-sm sm:max-w-none">
					Copilot brings true local flavour to your story. Names, foods, places,
					even expressions — everything adapts to fit the culture, naturally.
				</p>
			</div>
			<div className="relative h-[500px] w-full -translate-y-[10%] overflow-hidden sm:h-[700px] sm:-translate-y-[18%] md:h-[853px]">
				<Image
					src={LOCALIZATION_IMAGE_URL}
					alt="Localization"
					fill
					className="object-cover object-left sm:object-center"
					priority
				/>
				<div className="absolute bottom-[6%] left-1/2 flex w-full max-w-xs -translate-x-1/2 flex-col items-center justify-center gap-2 px-2 text-center sm:max-w-none sm:gap-3 sm:px-0 md:flex-row">
					<div className="bg-fm-surface-contrast text-fm-contrast px-2 py-3 text-sm font-medium shadow sm:px-2 sm:py-4 sm:text-lg md:text-xl">
						Peter eats a cheese burger in a New York diner
					</div>
					<ArrowRightLeft
						strokeWidth={1}
						size={24}
						className="rotate-90 sm:size-9 md:rotate-0"
					/>
					<div className="bg-fm-hotpink-50 text-fm-divider-brand-secondary px-2 py-3 text-sm sm:px-2 sm:py-4 sm:text-lg md:text-xl">
						&ldquo;André enjoys a panini at a café in Paris&rdquo;
					</div>
				</div>
			</div>
		</section>
	)
}

export default LocalizationSection
