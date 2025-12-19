import { API_URLS } from '@/constants/global-constants'
import { GET_CMS_SHOWS_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import {
	TGetCMSShowsAPIResponse,
	TGetCMSShowsQueryParams,
} from '@/types/story-types'

const useGetCMSShows = (searchQuery?: string) => {
	const getCMSShows = async () => {
		if (!searchQuery) {
			return null
		}
		const response = await fetchAPI<
			TGetCMSShowsAPIResponse,
			TNoParams,
			TNoParams,
			TGetCMSShowsQueryParams
		>({
			url: API_URLS.GET_CMS_SHOWS,
			method: 'GET',
			query: {
				query: searchQuery,
			},
		})
		return response.data?.result
	}
	const query = useQuery({
		queryKey: [GET_CMS_SHOWS_QUERY_KEY, searchQuery],
		queryFn: () => getCMSShows(),
		enabled: !!searchQuery,
	})
	return query
}

export default useGetCMSShows
