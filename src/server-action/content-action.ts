import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'
import { getGCSContent } from '@/lib/utils/gcs'

import {
	SaveEpisodeParams,
	TEpisode,
	TGetEpisodeResponse,
	TGetEpisodeUrlParams,
	TGetNewEpisodeResponse,
	TPatchEpisodeBody,
	TPatchEpisodeUrlParams,
} from '@/types/episode-type'

export async function getAdditionalViews(views?: Record<string, string>) {
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

	const text = await getGCSContent({ url: chapter.file_url })

	return {
		...episodeData.data,
		text,
		additional_view: chapter.props?.views,
		translation_text: chapter.translation_url,
		chapter: {
			...(episodeData?.data?.chapter || {}),
			props: {
				...(episodeData?.data?.chapter?.props || {}),
				llm_memories: {
					...(episodeData?.data?.chapter?.props?.llm_memories || {}),
					loglines:
						episodeData?.data?.chapter?.props?.llm_memories?.loglines ??
						episodeData?.data?.chapter?.props?.llm_memories?.logline ??
						'',
				},
			},
		},
	} as TGetEpisodeResponse
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
		url: API_URLS.SAVE_EPISODE,
		body: {
			...data,
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
