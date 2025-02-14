'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/episodes-constants'
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
