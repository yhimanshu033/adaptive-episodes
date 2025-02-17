import React from 'react'
import { usePageState } from '@/hooks/use-page-state'
import RenderPageButtons from '@/page-builders/episodes/render-page-btns'

import EpisodesLimit from './episodes-limit'

const EpisodesPagination = ({ totalPages }: { totalPages: number }) => {
	const { currentPage, setCurrentPage } = usePageState()

	const handlePageChange = (page?: number) => {
		void setCurrentPage(page ?? 0)
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

				<EpisodesLimit />
			</div>
		)
	)
}

export default EpisodesPagination
