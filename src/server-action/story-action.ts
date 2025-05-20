'use server'

import { API_URLS } from '@/constants/global-constants'

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
		defaultData: {
			results: {
				data: [],
				message: '',
			},
			count: 0,
			next: null,
			previous: null,
		},
		query: params,
	})

	return stories.data?.results?.data || []
}

export const getStoryData = async (
	storyId: TGetStoryDataUrlParams['storyId']
) => {
	const response = await fetchAPI<
		TGetStoryDataResponse,
		TGetStoryDataUrlParams
	>({
		method: 'GET',
		url: API_URLS.GET_STORY_DETAILS,
		urlParams: {
			storyId,
		},
	})

	return response.data?.data
}
