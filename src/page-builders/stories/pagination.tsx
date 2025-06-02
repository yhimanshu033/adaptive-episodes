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
		<div className="border-fm-divider-tertiary mb-6 flex flex-col justify-between gap-4 border-y py-4 sm:flex-row sm:items-center">
			<LimitDropdown
				value={String(params.limit)}
				onValueChange={(v) => changeParams({ limit: Number(v), page: 1 })}
			/>
			<div className="flex justify-center gap-2">
				<PaginationButtons totalPages={totalPages || 0} />
			</div>
		</div>
	)
}
