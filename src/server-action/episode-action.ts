'use server'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import {
	TGeEpisodesQueryParams,
	TGetEpisodesResponse,
} from '@/types/episode-type'

export const getEpisodes = async (
	project_id: number,
	page: number = 1,
	title: string = ''
) => {
	const episodes = await fetchAPI<
		TGetEpisodesResponse,
		TNoParams,
		TNoParams,
		TGeEpisodesQueryParams
	>({
		method: 'GET',
		url: '/chapter/',
		query: {
			project_id,
			page,
			title,
		},
	})
	return episodes
}
