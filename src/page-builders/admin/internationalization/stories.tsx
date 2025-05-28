'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import {
	countries,
	countryFlags,
	stories,
	storyID,
} from '@/mock-data/internationalization'
import ImportStoryCard from '@/page-builders/stories/import-story-card'
import { BookOpen, Clock, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { formatDate } from '@/lib/format-date'

const Stories = () => {
	const [activeVersions, setVersions] = useState(() =>
		stories.reduce(
			(acc, story) => {
				acc[story.id] = countries.Germany
				return acc
			},
			{} as Record<storyID, countries>
		)
	)
	return (
		<section className="my-6 grid flex-1 auto-rows-min grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			<ImportStoryCard />
			{stories?.map(({ versions, id }) => (
				<Card key={id} className="w-64 overflow-hidden">
					<div className="relative aspect-square">
						<Image
							src={versions[activeVersions[id]]?.image || COPILOT_LOGO_URL}
							alt={`${versions[activeVersions[id]]?.title} thumbnail`}
							layout="fill"
							objectFit="cover"
							className="transition-transform duration-300 hover:scale-105"
							loading="lazy"
							unoptimized
						/>
						<div className="absolute right-0 z-10 m-3 outline-hidden">
							<Select
								defaultValue={countries.Germany}
								onValueChange={(value) => {
									setVersions((prev) => ({ ...prev, [id]: value }))
								}}
							>
								<SelectTrigger>
									<span>{countryFlags[activeVersions[id]]}</span>
								</SelectTrigger>
								<SelectContent>
									{Object.keys(versions).map((key) => (
										<SelectItem key={key} value={key}>
											<div className="flex items-center">
												<span className="mr-2">
													{countryFlags[key as keyof typeof countryFlags]}
												</span>
												{key}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<CardContent className="space-y-2 p-4">
						<h3 className="line-clamp-1 text-lg font-bold">
							{versions[activeVersions[id]]?.title}
						</h3>

						<p className="flex items-center text-sm">
							<User className="mr-1 size-3" />
							Anonymous
						</p>
						<p className="flex items-center text-sm">
							<BookOpen className="mr-1 size-3" />
							<span>100 episodes</span>
						</p>
						<p className="text-muted-foreground flex items-center text-sm">
							<Clock className="mr-1 size-3" />
							<span>{formatDate(Date.now())}</span>
						</p>
						<Badge className="ßhover:bg-transparent bg-green-100 text-green-800">
							Imported
						</Badge>
					</CardContent>
				</Card>
			))}
		</section>
	)
}

export default Stories
