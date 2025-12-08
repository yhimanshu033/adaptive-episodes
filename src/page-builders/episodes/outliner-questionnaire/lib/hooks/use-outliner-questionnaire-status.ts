import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_QUESTIONNAIRE_STATUS_QUERY_KEY } from '@/constants/query-constants'
import {
	TGetOutlinerQuestionnaireStatus,
	TGetOutlinerQuestionnaireStatusQueryParams,
	TUpdateOutlinerQuestionnaireStatusBody,
	TUpdateOutlinerQuestionnaireStatusUrlParams,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export function useOutlinerQuestionnaireStatus(disable = false) {
	const { id } = useParams()
	async function getOutlinerQuestionnaireStatus() {
		if (!id) {
			return
		}
		const project_id = String(id)
		const resp = await fetchAPI<
			TGetOutlinerQuestionnaireStatus,
			TNoParams,
			TNoParams,
			TGetOutlinerQuestionnaireStatusQueryParams
		>({
			method: 'GET',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_STATUS,
			query: {
				project_id,
			},
		})

		return resp.data
	}

	const query = useQuery({
		queryKey: [OUTLINER_QUESTIONNAIRE_STATUS_QUERY_KEY, id],
		queryFn: getOutlinerQuestionnaireStatus,
		enabled: !disable,
	})

	return query
}

export function useOutlinerQuestionnaireStatusMutation() {
	const { id } = useParams()
	const queryClient = useQueryClient()

	async function setOutlinerQuestionnaireStatus(
		body: TUpdateOutlinerQuestionnaireStatusBody
	) {
		if (!id) {
			return
		}
		const projectId = String(id)
		const resp = await fetchAPI<
			TNoParams,
			TUpdateOutlinerQuestionnaireStatusUrlParams,
			TUpdateOutlinerQuestionnaireStatusBody
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_STATUS_UPDATE,
			urlParams: {
				projectId,
			},
			body,
		})

		return resp.data
	}

	const mutation = useMutation({
		mutationFn: setOutlinerQuestionnaireStatus,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: [OUTLINER_QUESTIONNAIRE_STATUS_QUERY_KEY, id],
				refetchType: 'none',
			})
		},
	})

	return mutation
}
