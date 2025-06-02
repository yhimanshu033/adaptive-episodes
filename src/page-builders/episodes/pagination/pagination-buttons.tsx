import React, { useCallback } from 'react'
import { DEFAULT_PAGE } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'
import PaginationNavigation from '@/page-builders/episodes/pagination/pagination-navigation'
import RenderPageButtons from '@/page-builders/episodes/pagination/render-page-btns'

import {
	PaginationContent,
	PaginationRoot,
} from '@/components/aural-ui/pagination'

interface PaginationButtonsProps {
	totalPages: number
}
export default function PaginationButtons({
	totalPages,
}: PaginationButtonsProps) {
	const { currentPage, setCurrentPage } = usePageState()

	const handlePageChange = useCallback(
		(page?: number) => {
			void setCurrentPage(page ?? DEFAULT_PAGE)
		},
		[setCurrentPage]
	)

	return (
		<PaginationRoot>
			<PaginationContent>
				<PaginationNavigation
					totalPages={totalPages}
					handlePageChange={handlePageChange}
				>
					<RenderPageButtons
						currentPage={currentPage}
						handlePageChange={handlePageChange}
						totalPages={totalPages}
					/>
				</PaginationNavigation>
			</PaginationContent>
		</PaginationRoot>
	)
}
