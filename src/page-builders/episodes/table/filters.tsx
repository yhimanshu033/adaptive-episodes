import React, { useEffect, useState } from 'react'
import { usePageState } from '@/hooks/use-page-state'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'

import Search from '@/components/aural-ui/search'
import { Skeleton } from '@/components/aural-ui/skelton'
import IfElse, { Else, If } from '@/components/if-else'

import { TEpisodeSearchForm } from '@/types/episode-type'

const Filters = ({
	totalEpisodes = 0,
	setSearchedRow,
	isLoading = false,
}: {
	isLoading?: boolean
	setSearchedRow: React.Dispatch<React.SetStateAction<number | null>>
	totalEpisodes?: number
}) => {
	const [fetchedSeqNumber, setFetchedSeqNumber] = useState<boolean>(false)
	const { limit, setSearch, setCurrentPage, search, seqNumber } = usePageState()

	const handleSearch = (data: TEpisodeSearchForm) => {
		if (Number(data.input)) {
			const input = Number(data.input)
			if (input > totalEpisodes) {
				toast.info('Total episodes exceeded', {
					description: `Please search within ${totalEpisodes} episodes`,
				})
				return
			} else if (input <= 0) {
				toast.info('Invalid input', {
					description: `Please enter a positive number`,
				})
				return
			}
			const page = Math.ceil(Number(input) / limit)
			const row = input % limit || limit
			void setSearch('')
			void setCurrentPage(page)
			setSearchedRow(row)
		} else {
			void setSearch(data.input)
			void setCurrentPage(1)
		}
	}

	// Debounced search function for typing
	const debouncedSearch = useDebounceCallback((value: string) => {
		handleSearch({ input: value })
	}, 500)

	useEffect(() => {
		if (
			fetchedSeqNumber ||
			!seqNumber ||
			String(seqNumber) === search ||
			totalEpisodes === 0
		) {
			return
		}

		setFetchedSeqNumber(true)
		handleSearch({ input: String(seqNumber) })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seqNumber, totalEpisodes])

	return (
		<>
			<IfElse condition={isLoading && !search?.trim()}>
				<If>
					<Skeleton className="mb-2 flex h-12 min-w-80 flex-1 items-center gap-2" />
				</If>
				<Else>
					<Search
						placeholder="Search Episode"
						className="min-w-72"
						onSearch={debouncedSearch}
						initialValue={search}
					/>
				</Else>
			</IfElse>
		</>
	)
}

export default Filters
