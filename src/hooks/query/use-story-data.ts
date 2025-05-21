'use client'

import { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import {
	STORIES_QUERY_KEY,
	STORIES_SORT_QUERY_KEY,
	STORY_ID_QUERY_KEY,
} from '@/constants/query-constants'
import { getStories, getStoryData } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

import { getQueryKeysFromObject, sortOpenedStories } from '@/lib/utils/helpers'
import { getOpenedStories } from '@/lib/utils/indexed-db'

import { TGetStoriesQueryParams } from '@/types/story-types'

export const useStoriesData = (params: TGetStoriesQueryParams = {}) => {
	const path = usePathname()
	const sortStories = async () => {
		if (!stories.length) {
			return { sortedStories: [], openedStories: [] }
		}
		const openedStories = (await getOpenedStories()) || []
		return {
			sortedStories: sortOpenedStories(openedStories, Array.from(stories)),
			openedStories,
		}
	}
	const paramValues = getQueryKeysFromObject(params)
	const query = useQuery({
		queryKey: [STORIES_QUERY_KEY, ...paramValues],
		queryFn: async () => await getStories(params),
		staleTime: Infinity,
	})

	const { data } = query

	const stories = useMemo(() => data?.results?.data || [], [data])

	const { data: openedStoryData } = useQuery({
		queryKey: [STORIES_SORT_QUERY_KEY, stories?.length, path, ...paramValues],
		queryFn: sortStories,
		enabled: !!data,
		staleTime: 0,
		gcTime: 0,
	})

	return { ...query, ...openedStoryData, stories }
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
