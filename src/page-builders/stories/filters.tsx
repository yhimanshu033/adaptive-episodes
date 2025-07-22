import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import Search from '@/components/aural-ui/search'
import SearchSkeleton from '@/components/search-skelton'

const Filters = ({
	setSearch,
	isLoading,
	search,
}: {
	isLoading: boolean
	search: string
	setSearch: (str: string) => void
}) => {
	const debouncedSetSearch = useDebounceCallback(setSearch, 300)

	if (isLoading && !search?.trim()) {
		return <SearchSkeleton />
	}

	return (
		<Search
			onSearch={debouncedSetSearch}
			placeholder="Search Story"
			initialValue={search}
		/>
	)
}

export default Filters
