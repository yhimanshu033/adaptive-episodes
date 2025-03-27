'use client'

import { usePathname } from 'next/navigation'
import {
	STORIES_QUERY_KEY,
	STORIES_SORT_QUERY_KEY,
} from '@/constants/query-constants'
import { getStories } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

import { sortOpenedStories } from '@/lib/utils/helpers'
import { getOpenedStories } from '@/lib/utils/indexed-db'

export const useStoriesData = () => {
	const path = usePathname()
	const sortStories = async () => {
		if (!data) return { sortedStories: [], openedStories: [] }
		const openedStories = (await getOpenedStories()) || []
		return {
			sortedStories: sortOpenedStories(openedStories, Array.from(data)),
			openedStories,
		}
	}
	const query = useQuery({
		queryKey: [STORIES_QUERY_KEY],
		queryFn: getStories,
	})

	const { data } = query

	const { data: openedStoryData } = useQuery({
		queryKey: [STORIES_SORT_QUERY_KEY, data?.length, path],
		queryFn: sortStories,
		enabled: !!data,
		staleTime: 0,
		gcTime: 0,
	})

	return { ...query, ...openedStoryData }
}
