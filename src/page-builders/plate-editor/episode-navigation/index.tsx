import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import { useInfiniteEpisodesData } from '@/hooks/query/use-episode-data'
import useExtendedSaving from '@/hooks/use-extended-saving'
import useEditorExtendedStore from '@/store/extended-store'
import { Sidebar } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import { ScrollArea } from '@/components/ui/scroll-area'
import Spinner from '@/components/ui/spinner'
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

	if (simplifiedEditor || !page) {
		return null
	}
	return (
		<div className="animate-fade-in-up relative z-10">
			<Button
				className={cn(
					'absolute z-10 mt-4 rounded-full transition-all',
					episodeNavigationOpen ? '-right-5' : '-right-14'
				)}
				variant="outline"
				size="icon"
				onClick={toggleOpenNavigation}
			>
				<Sidebar />
			</Button>
			<div
				className={cn(
					'sticky top-0 text-clip transition-all',
					episodeNavigationOpen ? 'w-24' : 'w-0'
				)}
			>
				<ScrollArea className="h-svh">
					<InfiniteScrollWithDebouncing
						className=""
						skeleton={
							<div className="flex w-full justify-center">
								<Spinner />
							</div>
						}
					>
						<div className="flex flex-col">
							<ForEach data={sortedEpisodes}>
								{(item, idx) => (
									<Button
										variant="ghost"
										className={cn('h-auto justify-start py-4', {
											'bg-primary/40':
												item.seq_number === firstEpisode?.chapter?.seq_number,
										})}
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
