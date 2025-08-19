import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { DEFAULT_NAVIGATION_PAGE_LIMIT } from '@/constants/editor-constants'
import {
	EPISODE_SEQUENCE,
	SIMPLIFIED_VIEWABLE_EDITOR,
} from '@/constants/global-constants'
import { useInfiniteEpisodesData } from '@/hooks/query/use-episode-data'
import useExtendedSaving from '@/hooks/use-extended-saving'
import { LayoutLeftIcon } from '@/icons/layout-left-icon'
import EpisodeNavigationButton from '@/page-builders/plate-editor/episode-navigation/episode-navigation-button'
import {
	updateIsEpisodeNavigationOpen,
	useEditorStore,
} from '@/store/editor-store'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import CircularLoader from '@/components/ui/circular-loader'
import ForEach from '@/components/ui/for-each'
import { adjustScrollIfAtTop } from '@/lib/utils/client-helpers'
import { cn } from '@/lib/utils/helpers'

import { TGetEpisodesResponse } from '@/types/episode-type'

export default function EpisodeNavigation() {
	const { episodeId } = useParams()
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)
	const episodeSequence = searchParams.get(EPISODE_SEQUENCE)
	const isEpisodeNavigationOpen = useEditorStore(
		useShallow((state) => state.isEpisodeNavigationOpen)
	)
	const scrollRef = useRef<HTMLDivElement | null>(null)

	const page = useMemo(() => {
		return episodeSequence
			? Math.ceil(Number(episodeSequence) / DEFAULT_NAVIGATION_PAGE_LIMIT)
			: 1
	}, [episodeSequence])

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
			elem?.scrollIntoView({ block: 'center' })
		})
	}, [isEpisodeNavigationOpen, episodeId])

	useLayoutEffect(() => {
		adjustScrollIfAtTop(scrollRef.current)
	}, [sortedEpisodes])

	const toggleOpenNavigation = useCallback(() => {
		updateIsEpisodeNavigationOpen(!isEpisodeNavigationOpen)
	}, [isEpisodeNavigationOpen])

	if (simplifiedEditor || !data) {
		return null
	}

	return (
		<div className="animate-fade-in-up relative z-10 flex min-w-6">
			<IconButton
				icon={<LayoutLeftIcon />}
				label="Toggle Episode Navigation"
				variant="outlined"
				size="small"
				onClick={toggleOpenNavigation}
				className={cn(
					'border-fm-divider-tertiary absolute top-7 -right-4 z-10 bg-black',
					{
						'bg-fm-secondary-50 text-fm-secondary-800': isEpisodeNavigationOpen,
					}
				)}
			/>
			<div
				className={cn(
					'sticky top-0 overflow-x-hidden text-clip transition-all',
					isEpisodeNavigationOpen ? 'w-32' : 'w-0'
				)}
			>
				<ScrollArea className="h-svh" viewportRef={scrollRef}>
					<InfiniteScrollWithDebouncing
						skeleton={
							<div className="flex w-full justify-start p-4">
								<CircularLoader className="size-8" />
							</div>
						}
					>
						<div className="flex flex-col gap-2 px-2">
							<ForEach data={sortedEpisodes}>
								{(item) => (
									<EpisodeNavigationButton
										handleClick={() => void handleClick()}
										item={item}
										key={item.id}
									/>
								)}
							</ForEach>
						</div>
					</InfiniteScrollWithDebouncing>
				</ScrollArea>
			</div>
		</div>
	)
}
