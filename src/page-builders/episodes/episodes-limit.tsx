import React from 'react'
import { EPISODE_LIMITS } from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const EpisodesLimit = () => {
	const { limit, setLimit, currentPage, setCurrentPage } = usePageState()
	const handleChange = (value: string) => {
		const firstEpisodeNumber = (currentPage - 1) * limit + 1
		const newPage = Math.ceil(firstEpisodeNumber / Number(value))
		void setCurrentPage(newPage)
		void setLimit(Number(value))
	}

	return (
		<div className="flex items-center justify-between gap-2 text-xs">
			<p>Episodes per page</p>
			<Select value={String(limit)} onValueChange={handleChange}>
				<SelectTrigger className="w-16">
					<SelectValue>{limit}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{EPISODE_LIMITS.map((ele) => (
						<SelectItem key={ele} value={String(ele)}>
							{ele}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default EpisodesLimit
