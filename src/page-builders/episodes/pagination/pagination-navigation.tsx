import React, { useCallback } from 'react'
import { DEFAULT_PAGE } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'
import ChevronDoubleLeftIcon from '@/icons/chevron-double-left-icon'
import ChevronDoubleRightIcon from '@/icons/chevron-double-right-icon'
import ChevronLeftIcon from '@/icons/chevron-left-icon'
import ChevronRightIcon from '@/icons/chevron-right-icon'

import { PaginationButton } from '@/components/aural-ui/pagination'

interface PaginationNavigationProps {
	children: React.ReactNode
	handlePageChange: (page?: number) => void
	totalPages: number
}
export default function PaginationNavigation({
	totalPages,
	handlePageChange,
	children,
}: PaginationNavigationProps) {
	const { currentPage } = usePageState()

	const handleFirst = useCallback(() => {
		handlePageChange(DEFAULT_PAGE)
	}, [handlePageChange])

	const handleBack = useCallback(() => {
		handlePageChange(
			currentPage - 1 < DEFAULT_PAGE ? DEFAULT_PAGE : currentPage - 1
		)
	}, [handlePageChange, currentPage])

	const handleNext = useCallback(() => {
		handlePageChange(
			currentPage + 1 > totalPages ? totalPages : currentPage + 1
		)
	}, [handlePageChange, currentPage, totalPages])

	const handleLast = useCallback(() => {
		handlePageChange(totalPages)
	}, [handlePageChange, totalPages])

	return (
		<>
			<PaginationButton
				variant="navigation"
				onClick={handleFirst}
				disabled={currentPage <= DEFAULT_PAGE}
			>
				<ChevronDoubleLeftIcon />
			</PaginationButton>
			<PaginationButton
				variant="navigation"
				onClick={handleBack}
				disabled={currentPage <= DEFAULT_PAGE}
			>
				<ChevronLeftIcon />
			</PaginationButton>
			{children}
			<PaginationButton
				variant="navigation"
				onClick={handleNext}
				disabled={currentPage >= totalPages}
			>
				<ChevronRightIcon />
			</PaginationButton>
			<PaginationButton
				variant="navigation"
				onClick={handleLast}
				disabled={currentPage >= totalPages}
			>
				<ChevronDoubleRightIcon />
			</PaginationButton>
		</>
	)
}
