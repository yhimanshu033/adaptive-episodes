import React from 'react'
import { useDebounce } from '@/hooks/use-debounce'

import Search from '@/components/aural-ui/search'

const Filters = ({ setSearch }: { setSearch: (str: string) => void }) => {
	const debouncedSetSearch = useDebounce(setSearch, 300)

	return (
		<Search
			onSearch={debouncedSetSearch}
			placeholder="Search Story"
			initialValue=""
		/>
	)
}

export default Filters
