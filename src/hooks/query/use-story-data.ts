'use client'

import {
	STORIES_QUERY_KEY,
	STORIES_SORT_QUERY_KEY,
} from '@/constants/query-constants'
import { getStories } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

import { sortOpenedStories } from '@/lib/utils/helpers'
import { getOpenedStories } from '@/lib/utils/indexed-db'

export const useStoriesData = () => {
	const sortStories = async () => {
		if (!data) return undefined
		const openedStories = await getOpenedStories()
		return sortOpenedStories(openedStories, Array.from(data))
	}
	const query = useQuery({
		queryKey: [STORIES_QUERY_KEY],
		queryFn: getStories,
	})

	const { data } = query

	const { data: sortedStories } = useQuery({
		queryKey: [STORIES_SORT_QUERY_KEY, data?.length],
		queryFn: sortStories,
		enabled: !!data,
		staleTime: 0,
		gcTime: 0,
	})

	return { ...query, sortedStories }
}
