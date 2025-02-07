'use server'

import { fetchAPI } from '@/lib/fetch-api'
import { getWordCountFromString } from '@/lib/utils/plate'

import {
	SaveEpisodeParams,
	TEpisode,
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
	const word_count =
		data.word_count || (data.text ? getWordCountFromString(data.text) : 0)
	const responseData = await fetchAPI<
		TPatchEpisodeBody,
		TPatchEpisodeUrlParams,
		TPatchEpisodeBody
	>({
		method: 'PATCH',
		url: '/chapter/:projectId/:episodeId/',
		body: {
			...data,
			...(word_count ? { word_count } : {}),
		},
		urlParams: {
			projectId,
			episodeId,
		},
	})
	return responseData.data
}

export const updateEpisode = async ({
	projectId,
	episodeId,
	...data
}: TPatchEpisodeUrlParams & Partial<TEpisode>) => {
	const responseData = await fetchAPI<
		TPatchEpisodeBody,
		TPatchEpisodeUrlParams,
		Partial<TEpisode>
	>({
		method: 'PATCH',
		url: '/chapter/:projectId/:episodeId/',
		body: {
			...data,
		},
		urlParams: {
			projectId,
			episodeId,
		},
	})
	return responseData.data
}
