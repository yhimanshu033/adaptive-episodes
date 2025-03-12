'use client'

import { DEFAULT_EPISODE_LIMIT } from '@/constants/episodes-constants'
import { parseAsInteger, useQueryState } from 'nuqs'

import { EPISODE_LIMIT_KEY } from '@/types/episode-type'

export const usePageState = () => {
	const [currentPage, setCurrentPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1)
	)
	const [search, setSearch] = useQueryState('search', { defaultValue: '' })

	const userDefaultLimit =
		typeof window !== 'undefined'
			? Number(localStorage.getItem(EPISODE_LIMIT_KEY)) || DEFAULT_EPISODE_LIMIT
			: DEFAULT_EPISODE_LIMIT // fallback for SSR

	const [limit, setLimit] = useQueryState(
		'limit',
		parseAsInteger.withDefault(userDefaultLimit)
	)

	return {
		currentPage,
		setCurrentPage,
		search,
		setSearch,
		limit,
		setLimit,
		userDefaultLimit,
	}
}
