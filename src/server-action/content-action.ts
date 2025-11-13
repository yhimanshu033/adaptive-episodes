import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'
import { getGCSContent } from '@/lib/utils/gcs'
import { getWordCountFromString } from '@/lib/utils/plate'

import {
	SaveEpisodeParams,
	TEpisode,
	TGetEpisodeResponse,
	TGetEpisodeUrlParams,
	TGetNewEpisodeResponse,
	TPatchEpisodeBody,
	TPatchEpisodeUrlParams,
} from '@/types/episode-type'

export const getEpisodeContent = async (chapterId: number) => {
	const episodeData = await fetchAPI<
		TGetNewEpisodeResponse,
		TGetEpisodeUrlParams
	>({
		method: 'GET',
		url: API_URLS.GET_EPISODE,
		urlParams: {
			chapterId,
		},
	})

	if (!episodeData.data?.chapter) {
		return null
	}

	const [text, translation_text] = await Promise.all([
		getGCSContent({ url: episodeData.data?.chapter?.file_url }),
		getGCSContent({ url: episodeData.data?.chapter?.translation_url }),
	])

	return {
		...episodeData.data,
		text,
		translation_text,
	} as TGetEpisodeResponse
}

export const saveContent = async ({
	projectId,
	episodeId,
	...data
}: SaveEpisodeParams) => {
	let word_count = data.word_count
	if (word_count === undefined) {
		word_count = data.text ? getWordCountFromString(data.text) : 0
	}

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
	return responseData
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
