import React from 'react'
import { STORY_ID_QUERY_KEY } from '@/constants/query-constants'
import Episodes from '@/page-builders/episodes'
import { getStoryData } from '@/server-action/story-action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import getQueryClient from '@/lib/get-query-client'

interface PageProps {
	params: Promise<{ id: string }>
}

const Page = async ({ params }: PageProps) => {
	const queryClient = getQueryClient()

	// Await the params Promise
	const { id } = await params
	const projectId = Number(id)

	await queryClient.prefetchQuery({
		queryKey: [STORY_ID_QUERY_KEY, projectId],
		queryFn: () => getStoryData(projectId),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Episodes />
		</HydrationBoundary>
	)
}

export default Page
