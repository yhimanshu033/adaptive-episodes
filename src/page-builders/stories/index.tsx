'use client'

import React, { useState } from 'react'
import { DEFAULT_EPISODE_LIMIT } from '@/constants/episodes-constants'
import { useStoriesData } from '@/hooks/query/use-story-data'
import Filters from '@/page-builders/stories/filters'
import Stories from '@/page-builders/stories/stories'

import { TGetStoriesQueryParams } from '@/types/story-types'

const StoryDashboard = () => {
	const [params, setParams] = useState<TGetStoriesQueryParams>({
		limit: DEFAULT_EPISODE_LIMIT,
		page: 1,
		search: '',
	})

	const {
		data: stories,
		isLoading,
		sortedStories,
		openedStories,
	} = useStoriesData(params)

	return (
		<main className="container flex flex-1 animate-fade-in-up flex-col pt-6">
			<Filters
				setSearch={(search) => setParams((prev) => ({ ...prev, search }))}
			/>
			<Stories
				isLoading={isLoading}
				openedStories={openedStories}
				sortedStories={sortedStories}
				stories={stories}
			/>
		</main>
	)
}

export default StoryDashboard
