'use server'

import { fetchAPI } from '@/lib/fetch-api'
import { getWordCountFromString } from '@/lib/utils/plate'

import {
	SaveEpisodeParams,
	TGetEpisodeResponse,
	TGetEpisodeUrlParams,
	TPatchEpisodeBody,
	TPatchEpisodeUrlParams,
} from '@/types/episode-type'

export const getEpisodeContent = async (chapterId: number) => {
	const episodeData = await fetchAPI<TGetEpisodeResponse, TGetEpisodeUrlParams>(
		{
			method: 'GET',
			url: '/chapter/:chapterId/content/',

			urlParams: {
				chapterId,
			},
		}
	)

	return episodeData.data
}

export const saveContent = async ({
	projectId,
	episodeId,
	...data
}: SaveEpisodeParams) => {
	const responseData = await fetchAPI<
		TPatchEpisodeBody,
		TPatchEpisodeUrlParams,
		TPatchEpisodeBody
	>({
		method: 'PATCH',
		url: '/chapter/:projectId/:episodeId/',
		body: {
			...data,
			word_count: data.word_count || getWordCountFromString(data.text),
		},
		urlParams: {
			projectId,
			episodeId,
		},
	})
	return responseData.data
}
