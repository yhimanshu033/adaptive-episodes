'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CTA_BG_URL } from '@/constants/landing-constants'

import { Button } from '@/components/aural-ui/button'

export default function CTA() {
	return (
		<section className="mt-16 sm:mt-20">
			<div className="relative py-8 sm:py-10">
				<div className="absolute inset-0">
					<Image
						src={CTA_BG_URL}
						alt="CTA Background"
						fill
						className="w-full object-cover object-center"
					/>
				</div>
				<div className="relative z-10 container px-4 sm:px-0">
					<h2 className="sm:text-fm-2xl md:text-fm-4xl mb-6 text-xl sm:mb-8">
						Ready to write fast, smart, and
						<br className="hidden sm:block" /> reach a global audience?
					</h2>

					<Button
						variant="outline"
						size="lg"
						innerClassName="text-fm-neutral-50 bg-white w-full sm:w-54"
					>
						<Link href="/projects">Get started</Link>
					</Button>
				</div>
			</div>
			<footer className="text-fm-sm text-fm-tertiary p-4 text-center sm:p-6">
				&copy; 2025 Pocket CoPilot. All rights reserved
			</footer>
		</section>
	)
}
