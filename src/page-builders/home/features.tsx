import React from 'react'
import { FEATURES_LIST } from '@/constants/home-constants'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Features = async () => {
	const dict = await getTranslations('landing.features')
	return (
		<section className="animate-fade-in-down bg-card w-full flex-1 py-12 md:py-24 lg:py-32">
			<div className="container">
				<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					{dict('title')}
				</h2>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{FEATURES_LIST.map((item, index) => (
						<Card key={index} className="h-full">
							<CardHeader>
								<item.icon className="mx-auto mb-4 size-12" />
								<CardTitle className="text-center text-xl">
									{dict(item.title)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-center">{dict(item.content)}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features
