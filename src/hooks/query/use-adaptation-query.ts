import { API_URLS } from '@/constants/global-constants'
import { GET_LS_SHEET_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { doPoll } from '@/lib/do-poll'
import { migrateOldLSMapping } from '@/lib/utils/helpers'

import { TGetAdaptationLSUrlParams } from '@/types/ai-types'
import { ELanguage, LSMappingInput, TNoParams } from '@/types/common'

const useAdaptationQuery = ({
	language,
	projectId,
	enabled,
}: {
	enabled: boolean
	language: ELanguage
	projectId: string
}) => {
	const pollLSMapping = async () => {
		const pollingResp = await doPoll<
			TNoParams,
			LSMappingInput,
			TGetAdaptationLSUrlParams
		>({
			method: 'GET',
			url: API_URLS.GET_ADAPTATION_LS,
			urlParams: {
				language,
				projectId,
			},
			delay: 10000,
			stop: (resp) => {
				if (!resp.error && resp.data) {
					return true
				}
				return false
			},
		})
		const migratedData = migrateOldLSMapping(pollingResp?.data)

		return migratedData
	}

	const query = useQuery({
		queryKey: [GET_LS_SHEET_QUERY_KEY, projectId, language],
		queryFn: pollLSMapping,
		enabled,
	})
	return query
}

export default useAdaptationQuery
