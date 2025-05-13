'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import { usePaginatedAPI } from '@/hooks/use-paginated-api'
import { getEpisodes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodesData = (
	title: string = '',
	page: number = 1,
	limit?: number
) => {
	const { id } = useParams()
	const storyId = Number(id)

	const query = useQuery({
		queryKey: [EPISODE_LIST_QUERY_KEY, storyId, page, title, limit],
		queryFn: () =>
			getEpisodes({
				project_id: storyId,
				page,
				search: title,
				limit,
			}),
	})

	return query
}

export const useInfiniteEpisodesData = () => {
	const { id } = useParams()
	const storyId = Number(id)

	const query = usePaginatedAPI({
		initialPage: 1,
		queryKey: () => [EPISODE_LIST_QUERY_KEY, storyId],
		queryFn: (pageParam) =>
			getEpisodes({
				project_id: storyId,
				page: Number(pageParam),
				search: '',
			}),
		getNextPage: (lastPage, allPages) => {
			console.log({ lastPage })
			return lastPage?.next ? allPages.length + 1 : undefined
		},
	})

	return query
}
