'use client'

import { useParams } from 'next/navigation'
import {
	STORIES_QUERY_KEY,
	STORY_ID_QUERY_KEY,
} from '@/constants/query-constants'
import { getStories, getStoryData } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

import { getQueryKeysFromObject } from '@/lib/utils/helpers'

import { TGetStoriesQueryParams } from '@/types/story-types'

export const useStoriesData = (params: TGetStoriesQueryParams = {}) => {
	const paramValues = getQueryKeysFromObject(params)
	const query = useQuery({
		queryKey: [STORIES_QUERY_KEY, ...paramValues],
		queryFn: async () => await getStories(params),
		staleTime: 0,
		gcTime: 0,
	})
	return query
}

export const useStoryIdData = () => {
	const params = useParams()
	const id = Number(params?.id)

	const query = useQuery({
		queryKey: [STORY_ID_QUERY_KEY, id],
		queryFn: async () => await getStoryData(id),
	})

	return query
}
