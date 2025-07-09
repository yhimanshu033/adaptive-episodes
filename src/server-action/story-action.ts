'use server'

import { API_URLS } from '@/constants/global-constants'
import { DEFAULT_STORIES_RESPONSE } from '@/constants/story-constants'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import {
	TGetStoriesQueryParams,
	TGetStoriesResponse,
	TGetStoryDataResponse,
	TGetStoryDataUrlParams,
} from '@/types/story-types'

export const getStories = async (params: TGetStoriesQueryParams) => {
	const stories = await fetchAPI<
		TGetStoriesResponse,
		TNoParams,
		TNoParams,
		TGetStoriesQueryParams
	>({
		method: 'GET',
		url: API_URLS.GET_STORIES,
		defaultData: DEFAULT_STORIES_RESPONSE,
		query: params,
	})

	const data = (stories.data ||
		[]) as unknown as TGetStoriesResponse['results']['data']

	// IN CASE THE NEW API IS NOT DEPLOYED YET
	if (!stories.data?.results) {
		stories.data = {
			...DEFAULT_STORIES_RESPONSE,
			results: {
				...DEFAULT_STORIES_RESPONSE.results,
				data,
			},
			count: data.length,
		}
	}

	return stories.data
}

export const getStoryData = async (
	storyId: TGetStoryDataUrlParams['storyId']
) => {
	const response = await fetchAPI<
		TGetStoryDataResponse['data'],
		TGetStoryDataUrlParams
	>({
		method: 'GET',
		url: API_URLS.GET_STORY_DETAILS,
		urlParams: {
			storyId,
		},
	})
	// IN CASE THE NEW API IS NOT DEPLOYED YET
	if (!response?.data) {
		const storiesResponse = await getStories({})

		if (!storiesResponse?.results?.data) {
			return
		}

		const story = storiesResponse.results.data.find(
			(item) => item.id === storyId
		)
		return story
	}
	return response.data
}
