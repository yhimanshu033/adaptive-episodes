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
		<section id="faq" className="relative mt-40 w-full">
			<div className="container">
				<h2 className="text-fm-4xl font-display md:text-fm-7xl mb-12">
					Frequently asked questions
				</h2>

				<div>
					{faqItems.map((item, index) => (
						<Collapsible key={index}>
							<CollapsibleHeader className="pt-6 pb-4" title={item.question} />
							<CollapsibleContent>
								<p className="text-fm-xl">{item.answer}</p>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</div>
		</section>
	)
}
