import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useStoryData from '@/hooks/query/use-story-data'
import { BookOpen, User } from 'lucide-react'

import { Loader } from '@/components/loader'
import { Card, CardContent } from '@/components/ui/card'

const Stories = () => {
	const { data: stories, isLoading } = useStoryData()
	if (isLoading)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	return (
		<section className="container my-6 flex flex-wrap gap-6 self-start">
			{stories?.map((story) => (
				<Card key={story.id} className="w-64 overflow-hidden">
					<Link href={`/projects/${story.story_name}`}>
						<div className="relative aspect-[1/1]">
							<Image
								src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${story.story_name}/image`}
								alt={`${story.story_name} thumbnail`}
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 hover:scale-105"
								loading="lazy"
							/>
						</div>
						<CardContent className="p-4">
							<h3 className="mb-1 line-clamp-1 text-lg font-bold">
								{story.story_name}
							</h3>
							<p className="mb-2 flex items-center text-sm">
								<User className="mr-1 size-3" />
								{story.author}
							</p>
							<p className="flex items-center text-sm">
								<BookOpen className="mr-2 size-4" />
								<span>{story.episodes_count} episodes</span>
							</p>
						</CardContent>
					</Link>
				</Card>
			))}
		</section>
	)
}

export default Stories
