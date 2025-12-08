import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_QUESTIONNAIRE_STATUS_QUERY_KEY } from '@/constants/query-constants'
import {
	EOutlinerQuestionnaireTab,
	TGetOutlinerQuestionnaireStatus,
	TResetWriterProfileQueryParams,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useProfileReset() {
	const { id } = useParams()
	const queryClient = useQueryClient()
	async function resetProfile() {
		const project_id = Number(id)
		if (isNaN(project_id)) {
			toast.error('Could not reset profile')
			return
		}
		const resp = await fetchAPI<
			TNoParams,
			TNoParams,
			TNoParams,
			TResetWriterProfileQueryParams
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_PROFILE_RESET,
			query: {
				project_id,
			},
		})
		return resp
	}

	const mutation = useMutation({
		mutationFn: resetProfile,
		onSuccess: (data) => {
			if (!data) {
				return
			}
			queryClient.setQueryData(
				[OUTLINER_QUESTIONNAIRE_STATUS_QUERY_KEY, id],
				() => {
					return {
						result: {
							stage: EOutlinerQuestionnaireTab.START,
						},
					} as TGetOutlinerQuestionnaireStatus
				}
			)
		},
	})

	return mutation
}
