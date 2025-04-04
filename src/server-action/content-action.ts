'use server'

import { API_URLS } from '@/constants/global-constants'

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
			url: API_URLS.GET_EPISODE,
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
		url: API_URLS.SAVE_EPISODE,
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
		url: API_URLS.SAVE_EPISODE,
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
