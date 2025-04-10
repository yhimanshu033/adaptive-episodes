import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { buttonVariants, cn } from '@/lib/utils/helpers'

const Hero = async () => {
	const dict = await getTranslations('landing')
	return (
		<section className="container flex flex-1 animate-fade-in-up flex-col items-center justify-center gap-5">
			<Image
				src="/assets/copilot-logo.gif"
				alt="logo_animation"
				width={300}
				height={300}
				unoptimized
			/>
			<h1 className="font-display text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
				{dict('title')}
			</h1>
			<p className="max-w-[700px] text-center text-xl font-light opacity-80 md:text-2xl">
				{dict('description')}
			</p>
			<Link
				className={cn(buttonVariants({ size: 'lg' }), 'mt-3 text-lg')}
				href="/projects"
			>
				{dict('cta')}
			</Link>
		</section>
	)
}

export default Hero
