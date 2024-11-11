'use server'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetStoriesResponse } from '@/types/story-types'

export const getStories = async () => {
	const stories = await fetchAPI<TGetStoriesResponse>({
		method: 'GET',
		url: '/projects/',
		defaultData: [],
		onError: (error) => {
			const { message } = error
			throw new Error(message || 'Failed to fetch stories')
		},
	})

	return stories.data
}
