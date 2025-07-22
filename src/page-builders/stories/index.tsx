/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useCallback, useMemo } from 'react'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { usePageState } from '@/hooks/use-page-state'
import EmptyState from '@/page-builders/stories/empty-state'
import Filters from '@/page-builders/stories/filters'
import PaginationComponent from '@/page-builders/stories/pagination-component'
import Stories from '@/page-builders/stories/stories'

import { If } from '@/components/aural-ui/if-else'
import {
	PaginationProvider,
	usePagination,
} from '@/components/aural-ui/pagination'

import { TGetStoriesQueryParams } from '@/types/story-types'

const PaginatedStoryDashboard = () => {
	const { currentPage, limit, search, setCurrentPage, setLimit, setSearch } =
		usePageState()
	const { setPage } = usePagination()

	const changeParams = useCallback(
		(value: Partial<TGetStoriesQueryParams>) => {
			void setCurrentPage((prev) => value.page || prev)
			void setLimit((prev) => value.limit || prev)
			void setSearch((prev) => value.search ?? prev)
		},
		[setCurrentPage, setLimit, setSearch]
	)

	const params = useMemo(
		() => ({ limit, page: currentPage, search }),
		[limit, currentPage, search]
	)

	const { stories, isLoading, sortedStories, openedStories } =
		useStoriesData(params)

	const showEmpty = useMemo(
		() => !isLoading && (stories?.length === 0 || sortedStories?.length === 0),
		[isLoading, sortedStories?.length, stories?.length]
	)

	return (
		<main className="flex flex-1">
			<If condition={showEmpty && !search.trim()}>
				<EmptyState />
			</If>
			<If condition={!showEmpty || !!search.trim()}>
				<div className="container flex flex-1 flex-col pt-6">
					<Filters
						isLoading={isLoading}
						setSearch={(search) => {
							changeParams({ search, page: 1 })
							setPage(1)
						}}
						search={search}
					/>

					<Stories
						isLoading={isLoading}
						openedStories={openedStories}
						sortedStories={sortedStories}
						stories={stories}
						search={search}
					/>
					<PaginationComponent
						isLoading={isLoading}
						changeParams={changeParams}
					/>
				</div>
			</If>
		</main>
	)
}

const StoryDashboard = () => {
	const { currentPage, limit, search } = usePageState()

	const params = useMemo(
		() => ({ limit, page: currentPage, search }),
		[limit, search]
	)

	const { data } = useStoriesData(params)

	return (
		<PaginationProvider totalItems={data?.count || 1}>
			<PaginatedStoryDashboard />
		</PaginationProvider>
	)
}

export default StoryDashboard
