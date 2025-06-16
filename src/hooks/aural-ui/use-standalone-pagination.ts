import { useCallback, useEffect, useMemo, useState } from 'react'

export interface UseStandalonePaginationProps {
	initialPage?: number
	initialPageSize?: number
	siblingCount?: number
	totalItems: number
}

export interface UseStandalonePaginationReturn {
	currentPage: number
	firstPage: () => void
	isFirstPage: boolean
	isLastPage: boolean
	lastPage: () => void
	nextPage: () => void
	pageSize: number
	prevPage: () => void
	setPage: (page: number) => void
	setPageSize: (size: number) => void
	totalItems: number
	totalPages: number
	visiblePages: number[]
}

export const useStandalonePagination = ({
	initialPage = 1,
	initialPageSize = 10,
	totalItems,
	siblingCount = 1,
}: UseStandalonePaginationProps): UseStandalonePaginationReturn => {
	const [currentPage, setCurrentPage] = useState<number>(initialPage)
	const [pageSize, setPageSize] = useState<number>(initialPageSize)

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalItems / pageSize)),
		[totalItems, pageSize]
	)

	// Ensure current page is within valid range when dependencies change
	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages)
		}
	}, [totalPages, currentPage])

	const isFirstPage = currentPage === 1
	const isLastPage = currentPage === totalPages

	const setPage = useCallback(
		(page: number) => {
			const validPage = Math.min(Math.max(1, page), totalPages)
			setCurrentPage(validPage)
		},
		[totalPages]
	)

	const nextPage = useCallback(() => {
		if (!isLastPage) {
			setCurrentPage((prev) => prev + 1)
		}
	}, [isLastPage])

	const prevPage = useCallback(() => {
		if (!isFirstPage) {
			setCurrentPage((prev) => prev - 1)
		}
	}, [isFirstPage])

	const firstPage = useCallback(() => {
		setCurrentPage(1)
	}, [])

	const lastPage = useCallback(() => {
		setCurrentPage(totalPages)
	}, [totalPages])

	const updatePageSize = useCallback(
		(size: number) => {
			setPageSize(size)
			// Adjust current page to keep the same items visible when possible
			const firstItemIndex = (currentPage - 1) * pageSize
			const newPage = Math.floor(firstItemIndex / size) + 1
			setCurrentPage(Math.min(newPage, Math.ceil(totalItems / size)))
		},
		[currentPage, pageSize, totalItems]
	)

	// Calculate visible page numbers
	const visiblePages = useMemo(() => {
		const range = (start: number, end: number): number[] => {
			return Array.from({ length: end - start + 1 }, (_, i) => start + i)
		}

		const totalPageNumbers = siblingCount * 2 + 3 // siblings + current + first + last

		// Case 1: If the number of pages is less than the page numbers we want to show
		if (totalPages <= totalPageNumbers) {
			return range(1, totalPages)
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

		// Don't show dots if only one page would be hidden
		const shouldShowLeftDots = leftSiblingIndex > 2
		const shouldShowRightDots = rightSiblingIndex < totalPages - 1

		// Case 2: No left dots to show, but right dots
		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount
			return [...range(1, leftItemCount), -1, totalPages]
		}

		// Case 3: No right dots to show, but left dots
		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount
			return [1, -1, ...range(totalPages - rightItemCount + 1, totalPages)]
		}

		// Case 4: Both left and right dots to be shown
		return [
			1,
			-1,
			...range(leftSiblingIndex, rightSiblingIndex),
			-2,
			totalPages,
		]
	}, [currentPage, totalPages, siblingCount])

	return {
		currentPage,
		totalPages,
		pageSize,
		totalItems,
		setPage,
		nextPage,
		prevPage,
		firstPage,
		lastPage,
		setPageSize: updatePageSize,
		isFirstPage,
		isLastPage,
		visiblePages,
	}
}
