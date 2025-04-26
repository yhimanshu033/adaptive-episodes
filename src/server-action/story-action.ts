'use server'

import { API_URLS } from '@/constants/global-constants'
import { sampleStories } from '@/mock-data/testing'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetStoriesResponse } from '@/types/story-types'

export const getStories = async () => {
	return sampleStories
	const stories = await fetchAPI<TGetStoriesResponse>({
		method: 'GET',
		url: API_URLS.GET_STORIES,
		defaultData: [],
	})

	return stories.data ?? []
}
