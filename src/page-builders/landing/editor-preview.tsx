'use client'

import React from 'react'
import Image from 'next/image'
import {
	EDITOR_PREVIEW_URL,
	GLITTER_EFFECT_URL,
} from '@/constants/landing-constants'

export default function EditorPreviewSection() {
	return (
		<section className="mt-20 sm:mt-40">
			<div className="relative">
				<div className="absolute top-1/2 left-1/2 h-32 w-40 -translate-x-1/2 -translate-y-1/4 overflow-hidden sm:h-44 sm:w-56">
					<Image
						src={GLITTER_EFFECT_URL}
						alt="Effect"
						fill
						className="object-none object-center"
					/>
				</div>
				<h2 className="font-display md:text-fm-7xl text-fm-2xl sm:text-fm-4xl relative z-10 mb-8 text-center sm:mb-16">
					Write it right. Edit it tight.
				</h2>
			</div>
			<div className="border-fm-primary/5 relative z-10 mx-auto rounded-lg border-4 sm:border-8">
				<Image
					src={EDITOR_PREVIEW_URL}
					alt="Editor preview"
					width={1200}
					height={600}
					className="h-auto w-full rounded"
					priority
				/>
				<div className="from-fm-surface-primary pointer-events-none absolute -inset-x-1 -bottom-1 h-[40%] bg-linear-to-t from-30% to-transparent sm:-inset-x-2 sm:-bottom-2" />
			</div>
		</section>
	)
}
