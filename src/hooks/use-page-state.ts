'use client'

import { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { DEFAULT_EPISODE_LIMIT } from '@/constants/episodes-constants'
import {
	EPISODE_LIST_RECENT_QUERY_KEY,
	EPISODE_LIST_RECENT_QUERY_KEY_STORE,
} from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
	addOpenedEpisodeList,
	getOpenedEpisodeList,
} from '@/lib/utils/indexed-db'

import { EPISODE_LIMIT_KEY } from '@/types/episode-type'

export const usePageState = () => {
	const path = usePathname()
	const [currentPage, setCurrentPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1)
	)

	const [search, setSearch] = useQueryState('search', { defaultValue: '' })
	const [limit, setLimit] = useQueryState(
		'limit',
		parseAsInteger.withDefault(DEFAULT_EPISODE_LIMIT)
	)
	const { id: paramId } = useParams()
	const id = Number(paramId)

	async function getOpenedEpisodePage(id: number | undefined) {
		if (!id) return
		const map = (await getOpenedEpisodeList()) || {}
		void setSearch((prev) => map[id]?.search || prev)
		void setCurrentPage((prev) => (prev === 1 ? map[id]?.page || 1 : prev))
		void setLimit(
			(prev) =>
				map[id]?.limit ||
				Number(localStorage.getItem(EPISODE_LIMIT_KEY)) ||
				prev
		)
		return map[id] || {}
	}

	const { isLoading, data } = useQuery({
		queryKey: [EPISODE_LIST_RECENT_QUERY_KEY, id, path],
		queryFn: () => getOpenedEpisodePage(id),
		enabled: !!id,
		staleTime: 0,
		gcTime: 0,
	})

	const seqNumber = useMemo(() => data?.seqNumber, [data])

	function handleUpdate() {
		if (
			currentPage === data?.page &&
			search === data?.search &&
			limit === data?.limit
		)
			return false
		void addOpenedEpisodeList({
			project: id,
			data: { page: currentPage, search, limit, seqNumber: undefined },
		})
		return true
	}
	useQuery({
		queryKey: [
			EPISODE_LIST_RECENT_QUERY_KEY_STORE,
			id,
			currentPage,
			search,
			limit,
		],
		queryFn: handleUpdate,
		enabled: !!id && !isLoading,
		staleTime: 0,
		gcTime: 0,
	})

	return {
		currentPage,
		setCurrentPage,
		search,
		setSearch,
		limit,
		setLimit,
		seqNumber,
		id,
		userDefaultLimit: data?.limit || DEFAULT_EPISODE_LIMIT,
	}
}
