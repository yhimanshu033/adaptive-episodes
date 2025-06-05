'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { EImportStatus } from '@/constants/story-constants'
import { ImageIcon } from '@/icons/image-icon'
import { PageSearchIcon } from '@/icons/page-search-icon'
import CreateAndImportCard from '@/page-builders/stories/create-and-import-card'
import ViewDeleteStory from '@/page-builders/stories/view-delete-story'

import Badge from '@/components/aural-ui/badge'
import Label from '@/components/aural-ui/label'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'
import { If } from '@/components/if-else'
import { Loader } from '@/components/loader'
import Image from '@/components/ui/image'
import { cn } from '@/lib/aural-ui/utils'
import { formatDate } from '@/lib/format-date'

import { TOpenedStories } from '@/types/common'
import { TStory } from '@/types/story-types'

interface IStories {
	isLoading: boolean
	openedStories: TOpenedStories | undefined
	search: string
	sortedStories: TStory[] | undefined
	stories: TStory[] | undefined
}

const Stories = ({
	isLoading,
	openedStories,
	sortedStories,
	stories,
	search,
}: IStories) => {
	const [openStoryId, setOpenStoryId] = useState<string | null>(null)
	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	}

	if (!!search.trim() && stories?.length === 0 && !isLoading) {
		return (
			<div className="flex grow flex-col items-center justify-center gap-4">
				<div className="bg-fm-surface-frosted/20 rounded-full p-4">
					<PageSearchIcon className="size-5" />
				</div>
				<Typography
					as="div"
					color="tertiary"
					variant="body-medium"
					className="max-w-83"
					align="center"
				>
					No results found. Check your spelling or try different keywords.
				</Typography>
			</div>
		)
	}

	return (
		<section className="my-6 grid flex-1 grid-cols-1 justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<CreateAndImportCard />
			{(sortedStories || stories || [])?.map((story) => {
				const isOpen = openStoryId === story.id.toString()
				return (
					<div
						key={story.id}
						className="group border-fm-divider-secondary bg-fm-surface-primary relative h-102 w-full max-w-77 cursor-pointer overflow-hidden rounded border"
					>
						<div className="absolute inset-0">
							<Image
								src="/assets/story_card_hover_bg.webp"
								alt="Background Image"
								className={cn(
									'h-full w-full rounded object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 peer-[data-state=open]:opacity-100',
									{ 'opacity-100': isOpen }
								)}
								priority={false}
							/>
						</div>
						<Link href={`/projects/${story.id}`}>
							<div className="z-10 flex h-full flex-col gap-4 p-4">
								<div className="relative aspect-square">
									<div className="absolute inset-x-0 top-2 z-10 flex justify-between px-2">
										<If
											condition={openedStories?.slice(0, 5).includes(story.id)}
										>
											<Tag size="xs" color="lemon" variant="promotional">
												Recently Opened
											</Tag>
										</If>
										<Tag
											color={
												story.status === EImportStatus.IMPORTING
													? 'lemon'
													: 'info'
											}
											leftIcon={story.status === EImportStatus.IMPORTING}
											size="xs"
											variant={
												story.status === EImportStatus.IMPORTING
													? 'promotional'
													: 'system'
											}
											emphasis="primary"
										>
											{story.status}
										</Tag>
									</div>
									<If condition={!!story.image?.trim()}>
										<Image
											src={story.image}
											alt={`${story.project_title} thumbnail`}
											className="rounded"
										/>
									</If>

									<If condition={!story.image?.trim()}>
										<div
											aria-label="No image available"
											role="img"
											className="flex min-h-69 w-full items-center justify-center rounded bg-gradient-to-b from-[#1d1d1d] to-[#1d1d1d]/0"
										>
											<ImageIcon className="text-fm-icon-inactive/30 size-11" />
										</div>
									</If>
								</div>
								<div className="z-10 flex h-full flex-col justify-between">
									<div className="flex flex-col gap-2">
										<Typography
											as="h2"
											variant="body-large"
											className="truncate overflow-hidden whitespace-nowrap"
										>
											{story.project_title}
										</Typography>
										<div className="text-fm-secondary flex items-center gap-1">
											<Typography
												as="span"
												variant="caption-medium"
												color="secondary"
												className="max-w-1/2 truncate overflow-hidden whitespace-nowrap"
											>
												{story.author ?? 'Anonymous'}
											</Typography>
											<span className="bg-fm-tertiary size-0.5" />
											<Label className="text-fm-tertiary max-w-1/2 truncate overflow-hidden whitespace-nowrap">
												{story.episode_count} episodes
											</Label>
										</div>
									</div>
									<Badge size="xs" className="w-fit">
										Edited {formatDate(story.update_time)}
									</Badge>
								</div>
								<ViewDeleteStory
									onOpenChange={(open) =>
										setOpenStoryId(open ? story.id.toString() : null)
									}
								/>
							</div>
						</Link>
					</div>
				)
			})}
		</section>
	)
}

export default Stories
