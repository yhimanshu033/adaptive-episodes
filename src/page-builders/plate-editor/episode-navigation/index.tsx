import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useInfiniteEpisodesData } from '@/hooks/query/use-episode-data'
import useExtendedSaving from '@/hooks/use-extended-saving'
import { LayoutLeftIcon } from '@/icons/layout-left-icon'
import useEditorExtendedStore from '@/store/extended-store'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import CircularLoader from '@/components/ui/circular-loader'
import ForEach from '@/components/ui/for-each'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, getPageFromEpisode } from '@/lib/utils/helpers'

import { TGetEpisodesResponse } from '@/types/episode-type'

export default function EpisodeNavigation() {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const { store: extendStore, toggleEpisodeNavigationOpen } =
		useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))
	const episodeMap = extendStore(useShallow((state) => state.episodeMap))
	const episodeNavigationOpen = extendStore(
		useShallow((state) => state.episodeNavigationOpen)
	)
	const { data: content, latestStatus } = useEpisodeContent()

	const firstEpisode = useMemo(
		() => episodeMap?.[extended[0]],
		[extended, episodeMap]
	)

	const page = useMemo(
		() => getPageFromEpisode(firstEpisode?.chapter),
		[firstEpisode]
	)

	const { InfiniteScrollWithDebouncing, data } = useInfiniteEpisodesData(page)

	const { handleExitBySaving } = useExtendedSaving()
	const { id } = useParams()

	const handleClick = async (episodeId: string) => {
		await handleExitBySaving({
			route: `/projects/${String(id)}/${episodeId}/editor`,
		})
	}

	const episodes = useMemo(
		() =>
			data.reduce(
				(acc, curr) => [...acc, ...(curr?.results?.data || [])],
				[] as TGetEpisodesResponse['results']['data']
			),
		[data]
	)
	const sortedEpisodes = useMemo(
		() => [...episodes].sort((a, b) => a.seq_number - b.seq_number),
		[episodes]
	)

	useEffect(() => {
		const elem = document.getElementById(
			`ep-btn-${firstEpisode?.chapter?.seq_number}`
		)
		if (!episodeNavigationOpen || !elem) {
			return
		}
		elem.scrollIntoView({ behavior: 'smooth' })
	}, [episodeNavigationOpen, firstEpisode])

	const toggleOpenNavigation = useCallback(() => {
		toggleEpisodeNavigationOpen()
	}, [toggleEpisodeNavigationOpen])

	if (simplifiedEditor || !content || !latestStatus) {
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
					'bg-fm-secondary-50 text-fm-secondary-800': episodeNavigationOpen,
				})}
			/>
			<div
				className={cn(
					'sticky top-0 text-clip transition-all',
					episodeNavigationOpen ? 'w-30' : 'w-0'
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
								{(item, idx) => (
									<Button
										variant="text"
										className={cn(
											'group text-fm-placeholder leading-fm-md border-l-2 border-transparent [font-size:var(--text-fm-md)] backdrop-blur-3xl focus-visible:ring-0 focus-visible:ring-offset-0',
											{
												'bg-fm-hotpink-50 text-fm-secondary-800 border-fm-hotpink-200':
													item.seq_number === firstEpisode?.chapter?.seq_number,
												'hover:bg-fm-hotpink-50 focus-visible:bg-fm-hotpink-50 hover:text-fm-secondary-800 focus-visible:text-fm-secondary-800':
													item.seq_number !== firstEpisode?.chapter?.seq_number,
											}
										)}
										innerClassName={cn(
											'justify-start translate-y-0 !px-fm-2xl rounded-none'
										)}
										id={`ep-btn-${item.seq_number}`}
										key={idx}
										onClick={() =>
											void handleClick(String(item.parent || item.id))
										}
									>
										EP {item.seq_number}
									</Button>
								)}
							</ForEach>
						</div>
					</InfiniteScrollWithDebouncing>
				</ScrollArea>
			</div>
		</div>
	)
}
