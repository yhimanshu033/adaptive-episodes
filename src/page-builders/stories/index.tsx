'use client'

import React, { useCallback, useMemo } from 'react'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { usePageState } from '@/hooks/use-page-state'
import Filters from '@/page-builders/stories/filters'
import Pagination from '@/page-builders/stories/pagination'
import Stories from '@/page-builders/stories/stories'

import { TGetStoriesQueryParams } from '@/types/story-types'

const StoryDashboard = () => {
	const { currentPage, limit, search, setCurrentPage, setLimit, setSearch } =
		usePageState()

	const changeParams = useCallback(
		(value: Partial<TGetStoriesQueryParams>) => {
			void setCurrentPage((prev) => value.page || prev)
			void setLimit((prev) => value.limit || prev)
			void setSearch((prev) => value.search || prev)
		},
		[setCurrentPage, setLimit, setSearch]
	)

	const params = useMemo(
		() => ({ limit, page: currentPage, search }),
		[limit, currentPage, search]
	)

	const { data, stories, isLoading, sortedStories, openedStories } =
		useStoriesData(params)

	const totalPages = useMemo(() => {
		if (!data?.count) {
			return 0
		}

		if (!limit) {
			return 1
		}

		return Math.ceil(data?.count / limit)
	}, [data, limit])

	return (
		<main className="container flex flex-1 animate-fade-in-up flex-col pt-6">
			<Filters
				setSearch={(search) => {
					changeParams({ search, page: 1 })
				}}
			/>
			<Stories
				isLoading={isLoading}
				openedStories={openedStories}
				sortedStories={sortedStories}
				stories={stories}
			/>
			<Pagination
				params={params}
				changeParams={changeParams}
				totalPages={totalPages}
			/>
		</main>
	)
}

export default StoryDashboard
