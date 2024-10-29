import React from 'react'
import StoryDashboard from '@/page-builders/stories'
import { getStories } from '@/server-action/story-action'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

const Page = async () => {
	const queryClient = new QueryClient()

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

export default Page
