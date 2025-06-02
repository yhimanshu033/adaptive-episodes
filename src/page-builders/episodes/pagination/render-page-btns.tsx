import React, { useMemo } from 'react'
import { DEFAULT_PAGE, PAGES_TO_SHOW } from '@/constants/episodes-constants'

import { PaginationButton } from '@/components/aural-ui/pagination'

export default function RenderPageButtons({
	currentPage,
	handlePageChange,
	totalPages,
}: {
	currentPage: number
	handlePageChange: (val: number) => void
	totalPages: number
}) {
	const startPage = useMemo(
		() =>
			Math.max(
				DEFAULT_PAGE,
				currentPage + PAGES_TO_SHOW > totalPages
					? totalPages - PAGES_TO_SHOW + 1
					: currentPage
			),
		[currentPage, totalPages]
	)
	const lastPage = useMemo(
		() => Math.min(totalPages, startPage + PAGES_TO_SHOW - 1),
		[startPage, totalPages]
	)

	return Array.from({ length: lastPage - startPage + 1 }).map((_, i) => (
		<PaginationButton
			key={i + 1}
			variant={currentPage === startPage + i ? 'active' : 'number'}
			onClick={() => handlePageChange(startPage + i)}
			className="size-10"
		>
			{startPage + i}
		</PaginationButton>
	))
}
