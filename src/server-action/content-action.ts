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

async function getAdditionalViews(views?: Record<string, string>) {
	if (!views || Object.keys(views).length === 0) {
		return {}
	}

	const entries = await Promise.all(
		Object.entries(views).map(async ([key, url]) => {
			const content = await getGCSContent({ url })
			return [key, content] as const
		})
	)

	return Object.fromEntries(entries)
}

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

	const chapter = episodeData?.data?.chapter

	if (!chapter) {
		return null
	}

	const [text, translation_text, additional_view] = await Promise.all([
		getGCSContent({ url: chapter.file_url }),
		getGCSContent({ url: chapter.translation_url }),
		getAdditionalViews(chapter.props?.views),
	])

	return {
		...episodeData.data,
		text,
		translation_text,
		additional_view,
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
