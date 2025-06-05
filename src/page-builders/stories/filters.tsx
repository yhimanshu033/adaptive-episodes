import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import Search from '@/components/aural-ui/search'

const Filters = ({ setSearch }: { setSearch: (str: string) => void }) => {
	const debouncedSetSearch = useDebounceCallback(setSearch, 300)

	return (
		<Search
			onSearch={debouncedSetSearch}
			placeholder="Search Story"
			initialValue=""
		/>
	)
}

export default Filters
