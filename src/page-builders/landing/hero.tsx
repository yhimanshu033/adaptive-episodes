import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LANDING_BACKGROUND_URL } from '@/constants/landing-constants'

import { Button } from '@/components/aural-ui/button'

export default function HeroSection() {
	return (
		<section className="h-[115vh] w-full overflow-hidden">
			<div className="relative z-10">
				<nav className="text-fm-primary flex items-center justify-between p-6">
					<div>
						<span className="font-display text-fm-4xl">COPILOT</span>
						<span className="text-fm-secondary text-fm-xl ml-1">
							by PocketFM
						</span>
					</div>
					<div className="font-display text-fm-secondary text-fm-sm hidden items-center gap-6 md:flex">
						<a href="#ai-features">AI FEATURES</a>
						<a href="#essentials">ESSENTIALS</a>
						<a href="#creations">CREATIONS</a>
						<a href="#faq">FAQ</a>
						<Button variant="outline" size="sm">
							<Link href="/projects">Try it for free</Link>
						</Button>
					</div>
				</nav>

				<div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
					<h1 className="text-6xl leading-tight">
						Write smart. Write fast. <br /> Go global.
					</h1>
					<p className="text-fm-tertiary text-fm-lg mb-8 max-w-xl">
						Adapt your story to 10+ languages, collaborate with other writers,
						and do more with our AI-powered Copilot
					</p>
					<Button variant="outline" size="lg">
						<Link href="/projects">Try it for free</Link>
					</Button>
				</div>
			</div>
			<div className="absolute inset-0">
				<Image
					src={LANDING_BACKGROUND_URL}
					alt="Background"
					fill
					sizes="100vw"
					className="w-full object-contain object-top"
					priority
				/>
			</div>
		</section>
	)
}
