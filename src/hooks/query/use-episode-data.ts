'use client'

import { useParams } from 'next/navigation'
import {
	DEFAULT_INITIAL_PAGE,
	DEFAULT_NAVIGATION_PAGE_LIMIT,
} from '@/constants/editor-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import { usePaginatedAPI } from '@/hooks/use-paginated-api'
import { getEpisodes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import { addOpenedEpisodeList } from '@/lib/utils/indexed-db'

export const useEpisodesData = (
	title: string = '',
	page: number = 1,
	limit?: number
) => {
	const { id } = useParams()
	const storyId = Number(id)

	async function getEpisodesData() {
		const data = await getEpisodes({
			project_id: storyId,
			page,
			search: title,
			limit,
		})

		if (!data?.results.data.length) {
			await addOpenedEpisodeList({
				data: {
					page: 1,
					search: '',
					seqNumber: undefined,
				},
				project: storyId,
			})
		}

		return data
	}

	const query = useQuery({
		queryKey: [EPISODE_LIST_QUERY_KEY, storyId, page, title, limit],
		queryFn: getEpisodesData,
	})

	return query
}

export const useInfiniteEpisodesData = (
	page: number | null = DEFAULT_INITIAL_PAGE
) => {
	const { id } = useParams()
	const storyId = Number(id)

	const query = usePaginatedAPI({
		initialPage: page || DEFAULT_INITIAL_PAGE,
		queryKey: () => [EPISODE_LIST_QUERY_KEY, storyId],
		queryFn: (pageParam) =>
			getEpisodes({
				project_id: storyId,
				page: Number(pageParam),
				search: '',
				limit: DEFAULT_NAVIGATION_PAGE_LIMIT,
			}),
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			return lastPage?.next ? lastPageParam + 1 : undefined
		},
		getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
			return firstPageParam <= 1 ? undefined : firstPageParam - 1
		},
		enabled: page !== null,
	})

	return query
}
