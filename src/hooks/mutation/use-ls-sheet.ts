import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { GET_LS_SHEET_QUERY_KEY } from '@/constants/query-constants'
import useLanguage from '@/hooks/use-language'
import useParentLanguage from '@/hooks/use-parent-language'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetAdaptationLSUrlParams } from '@/types/ai-types'
import { LSMappingInput } from '@/types/common'

export default function useLSSheetQuery() {
	const language = useLanguage()
	const parentLanguage = useParentLanguage()
	const { id: projectId } = useParams()
	async function getLSData() {
		if (language === parentLanguage) {
			return null
		}
		const resp = await fetchAPI<LSMappingInput, TGetAdaptationLSUrlParams>({
			method: 'GET',
			url: API_URLS.GET_ADAPTATION_LS,
			urlParams: {
				language,
				projectId: String(projectId),
			},
		})

		if (!resp.data) {
			toast.error('LS sheet not found!')
		}

		return resp.data
	}

	const query = useQuery({
		queryKey: [GET_LS_SHEET_QUERY_KEY, projectId, language],
		queryFn: getLSData,
	})

	return query
}
