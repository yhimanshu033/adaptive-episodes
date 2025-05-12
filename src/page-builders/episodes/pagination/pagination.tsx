import React from 'react'
import EpisodesLimit from '@/page-builders/episodes/pagination/episodes-limit'
import PaginationButtons from '@/page-builders/episodes/pagination/pagination-buttons'

const EpisodesPagination = ({ totalPages }: { totalPages: number }) => {
	if (!totalPages) {
		return null
	}

	return (
		<div className="mt-2 flex justify-between">
			<EpisodesLimit />
			<div className="flex gap-2">
				<PaginationButtons totalPages={totalPages} />
			</div>
		</div>
	)
}

export default EpisodesPagination
