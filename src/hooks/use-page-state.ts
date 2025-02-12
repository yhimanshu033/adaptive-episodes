import { parseAsInteger, useQueryState } from 'nuqs'

export const usePageState = () => {
	const [currentPage, setCurrentPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1)
	)
	const [search, setSearch] = useQueryState('search', { defaultValue: '' })

	return { currentPage, setCurrentPage, search, setSearch }
}
