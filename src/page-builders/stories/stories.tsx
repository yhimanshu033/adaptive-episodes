'use client'

import React from 'react'
import Link from 'next/link'
import { EImportStatus } from '@/constants/story-constants'
import { ImageIcon } from '@/icons/image-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { VerticalMenuIcon } from '@/icons/test-icons'
import CreateAndImportDialog from '@/page-builders/stories/create-and-import-dialog'

// import EditDeleteStory from '@/page-builders/stories/edit-delete-story'

import Badge from '@/components/aural-ui/badge'
import { IconButton } from '@/components/aural-ui/icon-button'
import Label from '@/components/aural-ui/label'
import { Tag } from '@/components/aural-ui/tag'
import { If } from '@/components/if-else'
import { Loader } from '@/components/loader'
import Image from '@/components/ui/image'
import { formatDate } from '@/lib/format-date'

import { TOpenedStories } from '@/types/common'
import { TStory } from '@/types/story-types'

interface IStories {
	isLoading: boolean
	openedStories: TOpenedStories | undefined
	sortedStories: TStory[] | undefined
	stories: TStory[] | undefined
}

// Doubt: Multiple author thing
// TO-DO importing and adaptation badge things
// TO-DO Add Pop over - on the vertical menu

const Stories = ({
	isLoading,
	openedStories,
	sortedStories,
	stories,
}: IStories) => {
	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	}

	return (
		<section className="my-6 grid flex-1 grid-cols-1 justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<CreateAndImportDialog>
				<div className="border-fm-divider-secondary flex min-h-102 w-full max-w-77 cursor-pointer items-center justify-center border-2 border-dashed">
					<div className="border-fm-divider-secondary/50 rounded-full border p-2">
						<PlusIcon className="size-8" />
					</div>
					{/* <IconButton label="" render={<PlusIcon/>}/> */}
				</div>
			</CreateAndImportDialog>
			{(sortedStories || stories || [])?.map((story) => (
				<div
					key={story.id}
					className="group border-fm-divider-secondary bg-fm-surface-primary relative min-h-102 w-full max-w-77 cursor-pointer overflow-hidden rounded border p-3"
				>
					<Link
						href={`/projects/${story.id}`}
						className="flex h-full flex-col justify-between gap-4"
					>
						<div className="relative aspect-square">
							<If condition={openedStories?.slice(0, 5).includes(story.id)}>
								<Tag
									className="absolute top-2 left-2 z-10"
									size="xs"
									color="lemon"
									variant="promotional"
								>
									Recently Opened
								</Tag>
							</If>
							<Tag
								className="absolute bottom-2 left-2 z-10"
								color={
									story.status === EImportStatus.IMPORTING ? 'lemon' : 'info'
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
						<div>
							<div className="space-y-2">
								<h3 className="truncate overflow-hidden text-xl whitespace-nowrap">
									{story.project_title}
								</h3>
								<div className="text-fm-secondary flex items-center gap-1 text-sm">
									<span className="max-w-1/2 truncate overflow-hidden whitespace-nowrap">
										{story.author ?? 'Anonymous'}
									</span>
									<span className="bg-fm-tertiary size-0.5" />
									<Label className="text-fm-tertiary max-w-1/2 truncate overflow-hidden whitespace-nowrap">
										{story.episode_count} episodes
									</Label>
								</div>
							</div>
							<Badge size="xs">Edited {formatDate(story.update_time)}</Badge>
						</div>
						<div className="absolute right-2 bottom-5 opacity-0 transition-opacity group-hover:opacity-100">
							{/* <EditDeleteStory> */}
							<IconButton
								label="Option menu"
								icon={<VerticalMenuIcon className="size-5" />}
								shape="square"
								variant="ghost"
							/>
							{/* </EditDeleteStory> */}
						</div>
					</Link>
				</div>
			))}
		</section>
	)
}

export default Stories
