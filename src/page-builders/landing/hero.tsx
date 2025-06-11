import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
	LANDING_BACKGROUND_URL,
	LANDING_BACKGROUND_URL_MOBILE,
} from '@/constants/landing-constants'

import { Button } from '@/components/aural-ui/button'

export default function HeroSection() {
	return (
		<section className="relative min-h-[calc(100dvh-80px)] w-full sm:min-h-dvh">
			<div className="animate-fade-in-down relative z-10">
				<div className="flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center px-6 text-center sm:min-h-[calc(100dvh-96px)]">
					<h1 className="text-fm-4xl sm:text-fm-5xl mb-4 leading-tight md:text-6xl">
						Write smart. Write fast.
						<br className="hidden sm:block" />
						Go global.
					</h1>
					<p className="text-fm-tertiary sm:text-fm-lg text-fm-lg mb-6 line-clamp-3 max-w-sm sm:mb-8 sm:max-w-xl">
						Adapt your story to 10+ languages, collaborate with other writers,
						and do more with our AI-powered Copilot
					</p>
					<Button
						variant="outline"
						size="lg"
						className="transition-transform hover:scale-105"
						innerClassName="sm:[font-size:var(--text-fm-xl)] [font-size:var(--text-fm-lg)] bg-fm-primary sm:bg-transparent text-fm-neutral-50 sm:text-fm-primary"
					>
						<Link href="/projects">Try it for free</Link>
					</Button>
				</div>
			</div>
			<div className="animate-fade-in-down absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-br from-[#240047]/50 via-[#470000]/50 to-[#470047]/50 sm:-top-24 sm:min-h-screen">
				<Image
					src={LANDING_BACKGROUND_URL}
					alt="Background"
					fill
					sizes="100vw"
					className="hidden w-full overflow-visible object-top sm:block"
					priority
				/>
				<Image
					src={LANDING_BACKGROUND_URL_MOBILE}
					alt="Background"
					fill
					sizes="100vw"
					className="block w-full overflow-visible object-top sm:hidden"
					priority
				/>
			</div>
		</section>
	)
}
