import React from 'react'
import { STORY_ID_QUERY_KEY } from '@/constants/query-constants'
import Episodes from '@/page-builders/episodes'
import { getStoryData } from '@/server-action/story-action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import getQueryClient from '@/lib/get-query-client'

interface PageProps {
	params: {
		id: string
	}
}

export default async function Page({ params }: PageProps) {
	const queryClient = getQueryClient()
	const id = Number(params.id)

	// Prefetch the story data
	await queryClient.prefetchQuery({
		queryKey: [STORY_ID_QUERY_KEY, id],
		queryFn: () => getStoryData(id),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Episodes />
		</HydrationBoundary>
	)
}
