import React, { useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import { useInfiniteEpisodesData } from '@/hooks/query/use-episode-data'
import useExtendedSaving from '@/hooks/use-extended-saving'
import { LayoutLeftIcon } from '@/icons/layout-left-icon'
import {
	updateIsEpisodeNavigationOpen,
	useEditorStore,
} from '@/store/editor-store'
import { useShallow } from 'zustand/react/shallow'

import {
	buttonVariants,
	innerButtonVariants,
} from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import CircularLoader from '@/components/ui/circular-loader'
import ForEach from '@/components/ui/for-each'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/helpers'

import { TGetEpisodesResponse } from '@/types/episode-type'

export default function EpisodeNavigation() {
	const { episodeId, id } = useParams()
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)
	const page = Number(searchParams.get('page')) || 1
	const isEpisodeNavigationOpen = useEditorStore(
		useShallow((state) => state.isEpisodeNavigationOpen)
	)

	const { InfiniteScrollWithDebouncing, data } = useInfiniteEpisodesData(page)

	const { handleExitBySaving } = useExtendedSaving()

	const handleClick = async () => {
		await handleExitBySaving({})
	}

	// Optimized: Combine flattening and sorting in one operation
	const sortedEpisodes = useMemo(() => {
		// Pre-calculate total length for better array allocation
		const totalLength = data.reduce(
			(sum, curr) => sum + (curr?.results?.data?.length || 0),
			0
		)

		// Create array with known capacity to avoid reallocation
		const flatEpisodes: TGetEpisodesResponse['results']['data'] = new Array(
			totalLength
		) as TGetEpisodesResponse['results']['data']

		// Single pass to flatten the array
		let index = 0
		for (const curr of data) {
			if (curr?.results?.data) {
				for (const episode of curr.results.data) {
					flatEpisodes[index++] = episode
				}
			}
		}

		// Sort the flattened array directly
		return flatEpisodes.sort((a, b) => a.seq_number - b.seq_number)
	}, [data])

	useEffect(() => {
		if (!isEpisodeNavigationOpen || !episodeId) {
			return
		}

		// Use requestAnimationFrame for better performance
		requestAnimationFrame(() => {
			const elem = document.getElementById(`ep-btn-${String(episodeId)}`)
			elem?.scrollIntoView({ behavior: 'smooth' })
		})
	}, [isEpisodeNavigationOpen, episodeId])

	const toggleOpenNavigation = useCallback(() => {
		updateIsEpisodeNavigationOpen(!isEpisodeNavigationOpen)
	}, [isEpisodeNavigationOpen])

	if (simplifiedEditor || !data) {
		return null
	}

	return (
		<div className="animate-fade-in-up relative z-10">
			<IconButton
				icon={<LayoutLeftIcon />}
				label="Toggle Episode Navigation"
				variant="outlined"
				size="small"
				onClick={toggleOpenNavigation}
				className={cn('absolute top-7 -right-4 z-10 bg-black', {
					'bg-fm-secondary-50 text-fm-secondary-800': isEpisodeNavigationOpen,
				})}
			/>
			<div
				className={cn(
					'sticky top-0 text-clip transition-all',
					isEpisodeNavigationOpen ? 'w-30' : 'w-0'
				)}
			>
				<ScrollArea className="h-svh">
					<InfiniteScrollWithDebouncing
						className=""
						skeleton={
							<div className="flex w-full justify-start p-4">
								<CircularLoader className="size-8" />
							</div>
						}
					>
						<div className="flex flex-col">
							<ForEach data={sortedEpisodes}>
								{(item, idx) => {
									const episode_id = item.parent || item.id
									const isActive = episode_id === Number(episodeId)

									return (
										<Link
											href={`/projects/${String(id)}/${String(episode_id)}/content`}
											className={cn(
												buttonVariants({
													variant: 'text',
												}),
												'group text-fm-placeholder leading-fm-md border-l-2 border-transparent [font-size:var(--text-fm-md)] backdrop-blur-3xl focus-visible:ring-0 focus-visible:ring-offset-0',
												{
													'bg-fm-hotpink-50 text-fm-secondary-800 border-fm-hotpink-200':
														isActive,
													'hover:bg-fm-hotpink-50 focus-visible:bg-fm-hotpink-50 hover:text-fm-secondary-800 focus-visible:text-fm-secondary-800':
														!isActive,
												}
											)}
											id={`ep-btn-${episode_id}`}
											key={`ep-btn-${episode_id}-${idx}`}
											onClick={void handleClick}
										>
											<span
												className={cn(
													innerButtonVariants({
														variant: 'text',
													}),
													'!px-fm-2xl translate-y-0 justify-start rounded-none'
												)}
											>
												EP {item.seq_number}
											</span>
										</Link>
									)
								}}
							</ForEach>
						</div>
					</InfiniteScrollWithDebouncing>
				</ScrollArea>
			</div>
		</div>
	)
}
