import React from 'react'
import { STORIES_QUERY_KEY } from '@/constants/global-constants'
import StoryDashboard from '@/page-builders/stories'
import { getStories } from '@/server-action/story-action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { queryClient } from '@/lib/get-query-client'

export default async function Page() {
	await queryClient.prefetchQuery({
		queryKey: [STORIES_QUERY_KEY],
		queryFn: getStories,
		staleTime: 0,
	})

	const dehydratedState = dehydrate(queryClient, {
		shouldDehydrateQuery: (query) => query.queryKey[0] === STORIES_QUERY_KEY,
	})

	return (
		<HydrationBoundary state={dehydratedState}>
			<StoryDashboard />
		</HydrationBoundary>
	)
}
