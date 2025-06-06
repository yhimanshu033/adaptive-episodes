import React, { useEffect } from 'react'
import { EPISODE_LIMITS } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'

import { Divider } from '@/components/aural-ui/divider'
import { Pagination, usePagination } from '@/components/aural-ui/pagination'

const EpisodesPagination = () => {
	const { setLimit, setCurrentPage } = usePageState()
	const { currentPage, pageSize } = usePagination()

	useEffect(() => {
		void setLimit(pageSize)
		void setCurrentPage(currentPage)
	}, [pageSize, currentPage, setLimit, setCurrentPage])

	return (
		<div>
			<Divider className="my-6" />
			<Pagination pageSizeOptions={EPISODE_LIMITS} showPageSize size="sm" />
			<Divider className="mt-6" />
		</div>
	)
}

export default EpisodesPagination
