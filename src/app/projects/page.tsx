import React from 'react'
import StoryDashboard from '@/page-builders/stories'
import { getStories } from '@/server-action/story-action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { queryClient } from '@/lib/get-query-client'

export default async function Page() {
	await queryClient.prefetchQuery({
		queryKey: ['stories'],
		queryFn: getStories,
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<StoryDashboard />
		</HydrationBoundary>
	)
}
