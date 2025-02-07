'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/episodes-constants'
import { getEpisodes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodesData = (title: string = '', page: number = 1) => {
	const { id } = useParams()
	const storyId = Number(id)
	const currPage = title ? 1 : page

	const query = useQuery({
		queryKey: [EPISODE_LIST_QUERY_KEY, storyId, currPage, title],
		queryFn: () => getEpisodes(storyId, currPage, title),
	})

	return query
}
