import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_QUESTIONNAIRE_PROFILE_QUERY_KEY } from '@/constants/query-constants'
import {
	TGetWriterProfileResponse,
	TPostWriterProfileBody,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

const fallbackData: TGetWriterProfileResponse = {
	result: {
		profile: {
			character_type: '',
			dialogue_style: '',
			genre: '',
			journey: '',
			relationship: '',
			show_style: '',
			story_length: '',
			world: '',
		},
	},
}
export function useOutlinerQuestionnaireProfile(disable = false) {
	async function getOutlinerQuestionnaireProfile() {
		const resp = await fetchAPI<TGetWriterProfileResponse>({
			method: 'GET',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_PROFILE,
		})

		return resp.data ?? fallbackData
	}

	const query = useQuery({
		queryKey: [OUTLINER_QUESTIONNAIRE_PROFILE_QUERY_KEY],
		queryFn: getOutlinerQuestionnaireProfile,
		enabled: !disable,
	})

	return query
}

export function useOutlinerQuestionnaireProfileMutation() {
	const queryClient = useQueryClient()

	async function setOutlinerQuestionnaireProfile(body: TPostWriterProfileBody) {
		const resp = await fetchAPI<TNoParams, TNoParams, TPostWriterProfileBody>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_PROFILE,
			body,
		})

		return resp.data
	}

	const mutation = useMutation({
		mutationFn: setOutlinerQuestionnaireProfile,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: [OUTLINER_QUESTIONNAIRE_PROFILE_QUERY_KEY],
				refetchType: 'none',
			})
		},
	})

	return mutation
}
