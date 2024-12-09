import React, { useState } from 'react'
import { setCurrentPage, useEpisodeStore } from '@/store/episode-store'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EpisodesPagination = ({ totalPages }: { totalPages: number }) => {
	const [inputPage, setInputPage] = useState<number>(0)
	const showEllipsis = totalPages > 7
	const pageNumbers = []

	const currentPage = useEpisodeStore((state) => state.currentPage)

	const handlePageChange = (page?: number) => {
		setCurrentPage(page ?? inputPage)
	}
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handlePageChange()
	}

	const addPageButton = (page: number, isCurrent: boolean) => {
		pageNumbers.push(
			<Button
				key={page}
				variant={isCurrent ? 'default' : 'outline'}
				onClick={() => handlePageChange(page)}
				className="size-10"
			>
				{page}
			</Button>
		)
	}

	if (showEllipsis) {
		if (currentPage <= 4) {
			for (let i = 1; i <= 5; i++) {
				addPageButton(i, currentPage === i)
			}
			pageNumbers.push(
				<span key="ellipsis1" className="px-2">
					...
				</span>
			)
			addPageButton(totalPages, false)
		} else if (currentPage >= totalPages - 3) {
			addPageButton(1, false)
			pageNumbers.push(
				<span key="ellipsis2" className="px-2">
					...
				</span>
			)
			for (let i = totalPages - 4; i <= totalPages; i++) {
				addPageButton(i, currentPage === i)
			}
		} else {
			addPageButton(1, false)
			pageNumbers.push(
				<span key="ellipsis3" className="px-2">
					...
				</span>
			)
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				addPageButton(i, currentPage === i)
			}
			pageNumbers.push(
				<span key="ellipsis4" className="px-2">
					...
				</span>
			)
			addPageButton(totalPages, false)
		}
	} else {
		for (let i = 1; i <= totalPages; i++) {
			addPageButton(i, currentPage === i)
		}
	}

	return (
		<>
			{totalPages ? (
				<div className="mt-2 flex justify-between">
					<div className="flex gap-2">{pageNumbers}</div>
					<form onSubmit={handleSubmit} className="flex items-center space-x-2">
						<Input
							type="number"
							placeholder="Page No."
							className="w-32 border"
							onChange={(e) => setInputPage(Number(e.target.value))}
							min={1}
							max={totalPages}
						/>
						<Button type="submit">Go</Button>
					</form>
				</div>
			) : null}
		</>
	)
}

export default EpisodesPagination
