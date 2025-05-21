import React from 'react'
import PaginationButtons from '@/page-builders/episodes/pagination/pagination-buttons'
import LimitDropdown from '@/page-builders/stories/limit-dropdown'

import { TGetStoriesQueryParams } from '@/types/story-types'

interface IStoryPaginationProps {
	changeParams: (value: Partial<TGetStoriesQueryParams>) => void
	params: TGetStoriesQueryParams
	totalPages?: number
}
export default function Pagination({
	changeParams,
	params,
	totalPages,
}: IStoryPaginationProps) {
	return (
		<div className="flex justify-between pb-6">
			<LimitDropdown
				value={String(params.limit)}
				onValueChange={(v) => changeParams({ limit: Number(v), page: 1 })}
			/>
			<div className="flex gap-2">
				<PaginationButtons totalPages={totalPages || 0} />
			</div>
		</div>
	)
}
