import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LANDING_BACKGROUND_URL, navLinks } from '@/constants/landing-constants'
import { Menu } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'

export default function HeroSection() {
	return (
		<section className="relative min-h-screen w-full">
			<div className="relative z-10">
				<nav className="text-fm-primary flex items-center justify-between p-4 sm:p-6">
					<div className="not-sm:flex not-sm:flex-col">
						<span className="font-display text-fm-4xl">COPILOT</span>
						<span className="text-fm-secondary text-fm-xl sm:ml-1">
							by PocketFM
						</span>
					</div>

					{/* Desktop Navigation */}
					<div className="font-display text-fm-secondary text-fm-sm hidden items-center gap-3 md:flex lg:gap-6">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="hover:text-fm-primary transition-colors"
							>
								{link.label}
							</a>
						))}
						<Button variant="outline" size="sm">
							<Link href="/projects">Try it for free</Link>
						</Button>
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden">
						<Popover>
							<PopoverTrigger>
								<IconButton
									variant="ghost"
									label="Menu"
									className=""
									icon={<Menu size={24} className="text-fm-primary" />}
								/>
							</PopoverTrigger>
							<PopoverContent className="w-auto">
								<div className="font-display text-fm-sm flex flex-col gap-4 p-4">
									{navLinks.map((link) => (
										<a
											key={link.href}
											href={link.href}
											className="hover:text-fm-primary text-fm-secondary transition-colors"
										>
											{link.label}
										</a>
									))}
									<Button variant="outline" size="sm" className="mt-2">
										<Link href="/projects">Try it for free</Link>
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</nav>

				<div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 text-center sm:px-6">
					<h1 className="mb-4 text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
						Write smart. Write fast.
						<br className="hidden sm:block" />
						Go global.
					</h1>
					<p className="text-fm-tertiary sm:text-fm-lg mb-6 line-clamp-3 max-w-sm text-sm sm:mb-8 sm:max-w-xl">
						Adapt your story to 10+ languages, collaborate with other writers,
						and do more with our AI-powered Copilot
					</p>
					<Button variant="outline" size="lg" className="w-full sm:w-auto">
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
					className="w-full overflow-visible object-cover object-top"
					priority
				/>
			</div>
		</section>
	)
}
