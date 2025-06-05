import React from 'react'
import EpisodesLimit from '@/page-builders/episodes/pagination/episodes-limit'

import {
	Pagination,
	PaginationProvider,
} from '@/components/aural-ui/pagination'

const EpisodesPagination = ({
	totalPages,
	totalItems,
}: {
	totalItems: number
	totalPages: number
}) => {
	if (!totalPages || !totalItems) {
		return null
	}

	return (
		<PaginationProvider totalItems={totalItems}>
			<div className="flex justify-between py-6">
				<EpisodesLimit />
				<div className="flex gap-2">
					<Pagination size="sm" />
				</div>
			</div>
		</PaginationProvider>
	)
}

export default EpisodesPagination
