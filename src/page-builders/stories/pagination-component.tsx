/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'

import { Divider } from '@/components/aural-ui/divider'
import { If } from '@/components/aural-ui/if-else'
import { Pagination, usePagination } from '@/components/aural-ui/pagination'
import { ScrollArea, ScrollBar } from '@/components/aural-ui/scroll-area'
import PaginationSkeleton from '@/components/pagination-skelton'

import { TGetStoriesQueryParams } from '@/types/story-types'

interface IStoryPaginationProps {
	changeParams: (value: Partial<TGetStoriesQueryParams>) => void
	isLoading: boolean
}
export default function PaginationComponent({
	isLoading,
	changeParams,
}: IStoryPaginationProps) {
	const { currentPage, pageSize, setPage } = usePagination()

	useEffect(() => {
		changeParams({ page: currentPage })
	}, [currentPage])

	useEffect(() => {
		changeParams({ limit: Number(pageSize), page: 1 })
		setPage(1)
	}, [pageSize])

	return (
		<div className="mb-6 flex flex-col justify-between gap-4 py-4">
			<Divider variant="primary" />
			<If condition={isLoading}>
				<PaginationSkeleton />
			</If>
			<If condition={!isLoading}>
				<ScrollArea>
					<Pagination showPageSize={true} pageSizeOptions={[5, 10, 15, 20]} />
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</If>

			<Divider variant="primary" />
		</div>
	)
}
