import React from 'react'
import { notFound } from 'next/navigation'
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

	try {
		await queryClient.fetchQuery({
			queryKey: [STORY_ID_QUERY_KEY, projectId],
			queryFn: () => getStoryData(projectId),
		})
	} catch (error) {
		console.error('Story not found:', error)
		notFound()
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Episodes />
		</HydrationBoundary>
	)
}

export default Page
