import React, { useEffect } from 'react'

import { Divider } from '@/components/aural-ui/divider'
import { Pagination, usePagination } from '@/components/aural-ui/pagination'
import { ScrollArea, ScrollBar } from '@/components/aural-ui/scroll-area'

import { TGetStoriesQueryParams } from '@/types/story-types'

interface IStoryPaginationProps {
	changeParams: (value: Partial<TGetStoriesQueryParams>) => void
	updateCurrentPage: (page: number) => void
}
export default function PaginationComponent({
	changeParams,
	updateCurrentPage,
}: IStoryPaginationProps) {
	const { currentPage, pageSize, setPage } = usePagination()

	useEffect(() => {
		updateCurrentPage(currentPage)
	}, [currentPage, updateCurrentPage])

	useEffect(() => {
		changeParams({ limit: Number(pageSize), page: 1 })
		setPage(1)
	}, [pageSize, changeParams, setPage])

	return (
		<div className="mb-6 flex flex-col justify-between gap-4 py-4">
			<Divider variant="primary" />
			<ScrollArea>
				<Pagination showPageSize={true} pageSizeOptions={[5, 10, 15, 20]} />
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<Divider variant="primary" />
		</div>
	)
}
