import React, { useState } from 'react'
import { usePageState } from '@/hooks/use-page-state'
import RenderPageButtons from '@/page-builders/episodes/render-page-btns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EpisodesPagination = ({ totalPages }: { totalPages: number }) => {
	const [inputPage, setInputPage] = useState<number>(0)

	const { currentPage, setCurrentPage } = usePageState()

	const handlePageChange = (page?: number) => {
		void setCurrentPage(page ?? inputPage)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handlePageChange()
	}

	return (
		!!totalPages && (
			<div className="mt-2 flex justify-between">
				<div className="flex gap-2">
					<RenderPageButtons
						currentPage={currentPage}
						handlePageChange={handlePageChange}
						totalPages={totalPages}
					/>
				</div>
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
		)
	)
}

export default EpisodesPagination
