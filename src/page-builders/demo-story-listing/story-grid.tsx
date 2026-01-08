'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@/icons/star-icon'

import { If } from '@/components/aural-ui/if-else'
import { Skeleton } from '@/components/aural-ui/skelton'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

import { DemoStory } from './data'

interface StoryCardProps {
	idx?: number
	onPlay: (story: DemoStory) => void
	story: DemoStory
}

function StoryCard({ story, onPlay, idx = 0 }: StoryCardProps) {
	const [isLoading, setIsLoading] = useState(true)

	const handleImageLoad = () => {
		setIsLoading(false)
	}

	const isColumnOne = idx <= 5

	return (
		<button
			onClick={() => onPlay(story)}
			className="group relative flex flex-col text-left transition-transform hover:scale-[1.02]"
		>
			{/* Cover image container */}
			<div className="relative w-full overflow-hidden rounded-md">
				{/* Loading skeleton */}
				<If condition={isLoading}>
					<Skeleton className="aspect-square w-full" />
				</If>

				{/* Story cover image */}
				<Image
					src={story.coverUrl}
					alt={story.title}
					width={200}
					height={200}
					className={cn(
						'aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105',
						{ 'opacity-0': isLoading }
					)}
					draggable={false}
					priority={isColumnOne}
					fetchPriority={isColumnOne ? 'high' : 'auto'}
					onLoad={handleImageLoad}
					title={story.title}
				/>

				{/* NEW Badge - top right (if no top rank) */}
				<If condition={story.isNew && !story.topRank}>
					<div className="absolute top-2 right-2">
						<Tag
							color="info"
							emphasis="primary"
							size="xs"
							className="shadow-lg"
						>
							NEW
						</Tag>
					</div>
				</If>
			</div>

			{/* Meta info row */}
			<div className="mt-2 flex flex-col gap-1">
				<div className="flex items-center justify-between gap-2">
					{/* Play count */}
					<If condition={!!story.plays}>
						<span className="text-fm-secondary text-sm font-medium">
							{story.plays}{' '}
							<span className="text-fm-tertiary text-xs uppercase">Plays</span>
						</span>
					</If>

					{/* Right side: completed badge + rating */}
					<div className="flex items-center gap-1.5">
						{/* Star rating */}
						<If condition={!!story.rating}>
							<div className="flex items-center gap-0.5">
								<StarIcon className="fill-fm-tertiary text-fm-tertiary size-3" />
								<span className="text-fm-secondary text-sm">
									{story.rating}
								</span>
							</div>
						</If>
					</div>
				</div>

				{/* Title */}
				<Typography
					variant="caption-medium"
					color="tertiary"
					className="line-clamp-1"
				>
					{story.title}
				</Typography>
			</div>
		</button>
	)
}

interface StoryGridProps {
	onPlay: (story: DemoStory) => void
	stories: DemoStory[]
	title: string
}

export default function StoryGrid({ title, stories, onPlay }: StoryGridProps) {
	return (
		<section className="px-6 py-6">
			{/* Section header */}
			<div className="mb-4 flex items-center justify-between">
				<Typography variant="label-large" as="h2">
					{title}
				</Typography>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
				{stories.map((story, idx) => (
					<StoryCard key={story.id} story={story} onPlay={onPlay} idx={idx} />
				))}
			</div>
		</section>
	)
}
