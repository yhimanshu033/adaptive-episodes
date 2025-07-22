import React, { useEffect } from 'react'
import { EPISODE_LIMITS } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'

import { usePagination } from '@/components/aural-ui/pagination'
import { SelectField, SelectItem } from '@/components/aural-ui/select'

const EpisodesLimit = () => {
	const { limit, setLimit, setCurrentPage } = usePageState()
	const { currentPage, pageSize, setPage, setPageSize } = usePagination()

	const handleChange = (value: string) => {
		const firstEpisodeNumber = (currentPage - 1) * pageSize + 1
		const newPage = Math.ceil(firstEpisodeNumber / Number(value))
		void setPage(newPage)
		void setLimit(Number(value))
	}
	useEffect(() => {
		void setCurrentPage(currentPage)
	}, [currentPage, setCurrentPage])

	useEffect(() => {
		setPageSize(limit)
	}, [limit, setPageSize])

	return (
		<div className="flex items-center justify-between gap-2">
			<p className="font-fm-brand text-fm-tertiary text-sm uppercase">
				Page Size
			</p>
			<SelectField
				classes={{
					root: 'border-fm-divider-tertiary rounded-sm outline-none cursor-pointer',
					trigger: {
						icon: 'text-fm-icon-inactive size-6 ml-1',
					},
				}}
				value={String(pageSize)}
				onValueChange={handleChange}
				decoration="outline"
				required
			>
				{EPISODE_LIMITS.map((ele) => (
					<SelectItem key={ele} value={String(ele)} className="text-sm">
						{ele}
					</SelectItem>
				))}
			</SelectField>
		</div>
	)
}

export default EpisodesLimit
