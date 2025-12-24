import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { GET_CMS_FAILED_EPISODES_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetCMSFailedEpisodesAPIResponse } from '@/types/episode-type'

const useCMSFailedEpisodes = () => {
	const { id: projectId }: { id: string } = useParams()

	const getCMSFailedEpisodes = async () => {
		const response = await fetchAPI<
			TGetCMSFailedEpisodesAPIResponse,
			{ projectId: string }
		>({
			url: API_URLS.CMS_FAILED_EPISODES,
			method: 'GET',
			urlParams: {
				projectId,
			},
		})

		return response.data?.result
	}
	const query = useQuery({
		queryKey: [GET_CMS_FAILED_EPISODES_QUERY_KEY, projectId],
		queryFn: () => getCMSFailedEpisodes(),
	})

	return query
}

export default useCMSFailedEpisodes
