import { DEFAULT_EPISODE_LIMIT } from '@/constants/episodes-constants'
import { parseAsInteger, useQueryState, useQueryStates } from 'nuqs'

export const usePageState = () => {
	const [currentPage, setCurrentPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1)
	)
	const [search, setSearch] = useQueryState('search', { defaultValue: '' })

	const [limit, setLimit] = useQueryState(
		'limit',
		parseAsInteger.withDefault(DEFAULT_EPISODE_LIMIT)
	)

	const [episodeRange, setEpisodeRange] = useQueryStates({
		start: parseAsInteger,
		end: parseAsInteger,
	})

	return {
		currentPage,
		setCurrentPage,
		search,
		setSearch,
		episodeRange,
		setEpisodeRange,
		limit,
		setLimit,
	}
}
