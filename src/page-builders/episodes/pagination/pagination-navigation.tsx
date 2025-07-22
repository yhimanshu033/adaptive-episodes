import React, { useCallback } from 'react'
import { DEFAULT_PAGE } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

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
			<Button
				size="icon"
				onClick={handleFirst}
				disabled={currentPage <= DEFAULT_PAGE}
			>
				<ChevronsLeft />
			</Button>
			<Button
				size="icon"
				onClick={handleBack}
				disabled={currentPage <= DEFAULT_PAGE}
			>
				<ChevronLeft />
			</Button>
			{children}
			<Button
				size="icon"
				onClick={handleNext}
				disabled={currentPage >= totalPages}
			>
				<ChevronRight />
			</Button>
			<Button
				size="icon"
				onClick={handleLast}
				disabled={currentPage >= totalPages}
			>
				<ChevronsRight />
			</Button>
		</>
	)
}
