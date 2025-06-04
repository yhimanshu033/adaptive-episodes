'use client'

import React from 'react'
import { faqItems } from '@/constants/landing-constants'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleHeader,
} from '@/components/aural-ui/collapsible'

export default function FAQ() {
	return (
		<section id="faq" className="relative mt-20 w-full sm:mt-40">
			<div className="container not-sm:px-4">
				<h2 className="font-display sm:text-fm-4xl md:text-fm-7xl mb-8 text-2xl sm:mb-12">
					Frequently asked questions
				</h2>

				<div>
					{faqItems.map((item, index) => (
						<Collapsible key={index}>
							<CollapsibleHeader
								className="pt-4 pb-3 sm:pt-6 sm:pb-4 [&_.collapsible-title]:text-lg [&_.collapsible-title]:md:text-2xl [&_.collapsible-title]:lg:text-3xl"
								title={item.question}
							/>
							<CollapsibleContent>
								<p className="text-fm-md md:text-fm-lg">{item.answer}</p>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</div>
		</section>
	)
}
