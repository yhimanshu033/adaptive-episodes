'use server'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetStoriesResponse } from '@/types/story-types'

export const getStories = async () => {
	const stories = await fetchAPI<TGetStoriesResponse>({
		method: 'GET',
		url: '/projects/',
		defaultData: [],
	})

	return stories.data ?? []
}
