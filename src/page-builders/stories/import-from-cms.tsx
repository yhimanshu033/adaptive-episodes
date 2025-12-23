import React, { useRef, useState } from 'react'
import useCMSUploadMutation from '@/hooks/mutation/use-cms-upload-mutation'
import useGetCMSShows from '@/hooks/query/use-get-cms-shows'
import useStoryStore from '@/store/story-store'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDebounceCallback } from 'usehooks-ts'

import { Button } from '@/components/aural-ui/button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { List, ListItem, ListSeparator } from '@/components/aural-ui/list'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import Search from '@/components/aural-ui/search'
import { Skeleton } from '@/components/aural-ui/skelton'
import { Typography } from '@/components/aural-ui/typography'
import Image from '@/components/ui/image'
import { cn } from '@/lib/aural-ui/utils'

import { TCMSShow } from '@/types/story-types'

const CMSList = ({
	stories,
	onStorySelect,
}: {
	onStorySelect: (story: TCMSShow) => void
	stories: TCMSShow[]
}) => {
	const viewportRef = useRef<HTMLDivElement>(null)

	const virtualizer = useVirtualizer({
		count: stories.length,
		getScrollElement: () => viewportRef.current,
		getItemKey: (index) => stories[index]?.entity_id ?? index,
		estimateSize: () => 63,
		overscan: 5,
	})

	const virtualItems = virtualizer.getVirtualItems()

	return (
		<IfElse condition={!!stories.length}>
			<List className={cn('bg-transparent', { 'h-full': stories.length })}>
				<If>
					<ScrollArea
						viewportRef={viewportRef}
						className="h-full overflow-auto"
					>
						<div
							style={{
								height: virtualizer.getTotalSize(),
								position: 'relative',
								width: '100%',
							}}
						>
							{virtualItems.map((virtualItem) => {
								const story = stories[virtualItem.index]
								return (
									<div
										key={virtualItem.key}
										ref={virtualizer.measureElement}
										data-index={virtualItem.index}
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											transform: `translateY(${virtualItem.start}px)`,
										}}
									>
										<React.Fragment>
											<ListItem
												className="cursor-pointer pt-4 !pb-3"
												onClick={() => onStorySelect(story)}
											>
												{story.image_url && (
													<Image
														src={story.image_url}
														alt={story.title}
														className="size-10 object-cover"
													/>
												)}
												<div>
													<Typography
														variant="body-medium"
														className="text-fm-md"
													>
														{story.title}
													</Typography>
													<Typography
														variant="body-small"
														color="tertiary"
														className="text-fm-sm"
													>
														{story.creator_name}
													</Typography>
												</div>
											</ListItem>
											{virtualItem.index !== stories.length - 1 && (
												<ListSeparator className="my-0 px-4" />
											)}
										</React.Fragment>
									</div>
								)
							})}
						</div>
					</ScrollArea>
				</If>
				<Else>
					<ListItem>
						<Typography
							variant="body-medium"
							className="text-fm-md"
							color="tertiary"
						>
							No Matches Found! Try again with another series name or ID.
						</Typography>
					</ListItem>
				</Else>
			</List>
		</IfElse>
	)
}

const SelectedStory = ({
	story,
	className,
}: {
	className?: string
	story?: TCMSShow | null
}) => {
	if (!story) {
		return null
	}
	return (
		<div className={cn('flex gap-4', className)}>
			{story.image_url && (
				<Image
					src={story.image_url}
					alt={story.title}
					className="size-25 object-cover"
				/>
			)}
			<div>
				<Typography variant="body-medium" className="text-fm-md">
					{story.title}
				</Typography>
				<Typography
					variant="body-small"
					color="tertiary"
					className="text-fm-sm"
				>
					{story.creator_name}
				</Typography>
			</div>
		</div>
	)
}

const ImportFromCMS = () => {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [selectedStory, setSelectedStory] = useState<TCMSShow | null>(null)
	const { data, isLoading } = useGetCMSShows(searchQuery)
	const { mutate: uploadCMSShow, isPending } = useCMSUploadMutation()
	const { setFormOpen } = useStoryStore()

	const handleSearch = useDebounceCallback((query: string) => {
		setSearchQuery(query)
	}, 300)

	const handleStorySelect = (story: TCMSShow) => {
		setSearchQuery('')
		setSelectedStory(story)
	}

	const handleImportSeries = () => {
		if (selectedStory) {
			uploadCMSShow(
				{
					show_id: selectedStory.entity_id,
					author: selectedStory.creator_name,
					image: selectedStory.image_url,
				},
				{
					onSuccess: () => {
						setFormOpen(false)
					},
				}
			)
		}
	}

	return (
		<section className="flex h-full min-h-0 flex-col gap-2 px-8">
			<Search
				placeholder="Search by series name or ID"
				clearOnEnter={false}
				onChange={handleSearch}
			/>
			<div className="min-h-0 flex-1">
				<If condition={!!searchQuery}>
					<IfElse condition={!isLoading}>
						<If>
							<CMSList
								stories={data?.stories || []}
								onStorySelect={handleStorySelect}
							/>
						</If>
						<Else>
							<div className="flex flex-col gap-2">
								{Array.from({ length: 6 }).map((_, index) => (
									<Skeleton key={index} className="h-16 w-full" />
								))}
							</div>
						</Else>
					</IfElse>
				</If>
				<SelectedStory
					story={selectedStory}
					className={cn('invisible', {
						visible: !!selectedStory && !searchQuery,
					})}
				/>
			</div>
			<Button
				isDisabled={!selectedStory || isPending}
				className={cn('mb-5 w-full', {
					'text-fm-neutral-300': !selectedStory || isPending,
				})}
				onClick={handleImportSeries}
			>
				{isPending ? 'Importing...' : 'Import Series'}
			</Button>
		</section>
	)
}

export default ImportFromCMS
