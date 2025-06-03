'use client'

import React, { useCallback, useMemo } from 'react'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { usePageState } from '@/hooks/use-page-state'
import EmptyState from '@/page-builders/stories/empty-state'
import Filters from '@/page-builders/stories/filters'
import PaginationComponent from '@/page-builders/stories/pagination-component'
import Stories from '@/page-builders/stories/stories'

import { PaginationProvider } from '@/components/aural-ui/pagination'

import { TGetStoriesQueryParams } from '@/types/story-types'

const PaginatedStoryDashboard = () => {
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

	const {
		// data,
		stories,
		isLoading,
		sortedStories,
		openedStories,
	} = useStoriesData(params)

	const showEmpty = useMemo(
		() => !isLoading && (stories?.length === 0 || sortedStories?.length === 0),
		[isLoading, sortedStories?.length, stories?.length]
	)

	// const totalPages = useMemo(() => {
	// 	if (!data?.count) {
	// 		return 0
	// 	}

	// 	if (!limit) {
	// 		return 1
	// 	}

	// 	return Math.ceil(data?.count / limit)
	// }, [data, limit])

	const updateCurrentPage = useCallback(
		(page: number) => {
			void setCurrentPage(page)
		},
		[setCurrentPage]
	)

	return (
		<main className="animate-fade-in-up flex flex-1">
			{showEmpty ? (
				<EmptyState />
			) : (
				<div className="container flex flex-1 flex-col pt-6">
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
					<PaginationComponent
						changeParams={changeParams}
						updateCurrentPage={updateCurrentPage}
					/>
				</div>
			)}
		</main>
	)
}

const StoryDashboard = () => {
	const { stories } = useStoriesData()

	return (
		<PaginationProvider totalItems={stories.length || 1}>
			<PaginatedStoryDashboard />
		</PaginationProvider>
	)
}

export default StoryDashboard
