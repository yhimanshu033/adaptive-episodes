/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Spinner from '@/components/ui/spinner'

import { TStory } from '@/types/story-types'

interface StoryGridProps {
	onSelect: (story: TStory) => void
	stories: TStory[]
}

export function StoryGrid({ stories, onSelect }: StoryGridProps) {
	return (
		<ScrollArea className="h-[500px] pr-4">
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{stories.map((story) => (
					<Card
						key={story.id}
						className="cursor-pointer transition-transform hover:scale-105"
						onClick={() => onSelect(story)}
					>
						<CardContent className="p-3">
							<div className="relative mb-3 p-4">
								{story.image ? (
									<img
										src={story.image}
										alt={story.project_title}
										className="rounded-md object-cover"
									/>
								) : (
									<Spinner size={64} />
								)}
							</div>
							<div className="space-y-2">
								<h3 className="line-clamp-1 font-semibold">
									{story.project_title}
								</h3>
								<div className="text-muted-foreground flex items-center justify-between text-sm">
									<span>{story.author || 'Unknown Author'}</span>
									<Badge>{story.episode_count} eps</Badge>
								</div>
								<p className="text-muted-foreground text-xs">
									Updated {formatDistanceToNow(new Date(story.update_time))} ago
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</ScrollArea>
	)
}
