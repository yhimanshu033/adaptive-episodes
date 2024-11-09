import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getEpisodes } from '@/server-action/episode-action'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useEpisodesData = (title: string = '') => {
	const { id } = useParams()
	const storyId = parseInt(id as string)
	const query = useInfiniteQuery({
		queryKey: [storyId, 'episodes', title],
		queryFn: ({ pageParam }) => getEpisodes(storyId, pageParam, title),
		getNextPageParam: (lastPage) => lastPage.data?.next,
		initialPageParam: 1,
	})

	const episodesList = useMemo(
		() => query.data?.pages.flatMap((page) => page.data?.results.data ?? []),
		[query.data]
	)
	return { query, episodesList }
}
