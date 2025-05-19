'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
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
