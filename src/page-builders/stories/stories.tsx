import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import { EImportStatus } from '@/constants/story-constants'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { BookOpen, Clock, User } from 'lucide-react'

import { Loader } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils/helpers'

import ImportStoryCard from './import-story-card'

const Stories = () => {
	const { data: stories, isLoading } = useStoriesData()
	if (isLoading)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	return (
		<section className="container my-6 grid grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			<ImportStoryCard />
			{stories?.map((story) => (
				<Card key={story.id} className="w-64 overflow-hidden">
					<Link href={`/projects/${story.id}`}>
						<div className="relative aspect-square">
							<Image
								src={story.image || COPILOT_LOGO_URL}
								alt={`${story.project_title} thumbnail`}
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 hover:scale-105"
								loading="lazy"
								unoptimized
							/>
						</div>
						<CardContent className="space-y-2 p-4">
							<h3 className="line-clamp-1 text-lg font-bold">
								{story.project_title}
							</h3>
							<p className="flex items-center text-sm">
								<User className="mr-1 size-3" />
								{story.author ?? 'Anonymous'}
							</p>
							<p className="flex items-center text-sm">
								<BookOpen className="mr-1 size-3" />
								<span>{story.episode_count} episodes</span>
							</p>
							<p className="flex items-center text-sm text-muted-foreground">
								<Clock className="mr-1 size-3" />
								<span>{formatDate(story.update_time)}</span>
							</p>
							<Badge
								className={cn(
									'ßhover:bg-transparent',
									story.status === EImportStatus.IMPORTING
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-green-100 text-green-800'
								)}
							>
								{story.status}
							</Badge>
						</CardContent>
					</Link>
				</Card>
			))}
		</section>
	)
}

export default Stories
