import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import {
	OUTLINER_QUESTIONNAIRE_NEW_IDEAS_MUTATION_KEY,
	OUTLINER_QUESTIONNAIRE_NEW_IDEAS_QUERY_KEY,
	OUTLINER_QUESTIONNAIRE_NEW_IDEAS_REGENERATE_MUTATION_KEY,
} from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	TGetStoryIdeasResponse,
	TGetStoryIdeasUrlParams,
	TPostStoryIdeasBody,
	TRegenerateStoryIdeasBody,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export function useOutlinerQuestionnaireNewIdeasMutation() {
	const { id } = useParams()
	const queryClient = useQueryClient()

	async function postOutlinerQuestionnaireNewIdeas(body: TPostStoryIdeasBody) {
		const projectId = String(id)

		const resp = await fetchAPI<
			TNoParams,
			TGetStoryIdeasUrlParams,
			TPostStoryIdeasBody
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_NEW_IDEAS,
			urlParams: {
				projectId,
			},
			body,
		})

		return resp.data
	}

	const mutation = useMutation({
		mutationKey: [OUTLINER_QUESTIONNAIRE_NEW_IDEAS_MUTATION_KEY, Number(id)],
		mutationFn: postOutlinerQuestionnaireNewIdeas,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [OUTLINER_QUESTIONNAIRE_NEW_IDEAS_QUERY_KEY, Number(id)],
				refetchType: 'none',
			})
		},
	})

	return mutation
}

const fallbackData = {
	message: '',
	result: {
		new_story_ideas: [],
		project_id: 0,
	},
	status: 1,
} as TGetStoryIdeasResponse
export function useOutlinerQuestionnaireNewIdeasQuery() {
	const { id } = useParams()

	async function getOutlinerQuestionnaireNewIdeas() {
		const projectId = String(id)
		const resp = await fetchAPI<
			TGetStoryIdeasResponse,
			TGetStoryIdeasUrlParams
		>({
			method: 'GET',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_NEW_IDEAS,
			urlParams: {
				projectId,
			},
		})

		return resp.data ?? fallbackData
	}

	const query = useQuery({
		queryKey: [OUTLINER_QUESTIONNAIRE_NEW_IDEAS_QUERY_KEY, Number(id)],
		queryFn: getOutlinerQuestionnaireNewIdeas,
	})

	return query
}

export function useOutlinerQuestionnaireNewIdeasRegenerationMutation() {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()

	async function regenerateOutlinerQuestionnaireNewIdeas(
		body: TRegenerateStoryIdeasBody
	) {
		const projectId = String(id)

		const taskId = await startTask<
			TRegenerateStoryIdeasBody,
			TNoParams,
			TGetStoryIdeasUrlParams
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_NEW_IDEAS_REGENERATE,
			urlParams: {
				projectId,
			},
			body,
		})

		return taskId
	}

	const mutation = useMutation({
		mutationKey: [
			OUTLINER_QUESTIONNAIRE_NEW_IDEAS_REGENERATE_MUTATION_KEY,
			Number(id),
		],
		mutationFn: regenerateOutlinerQuestionnaireNewIdeas,
	})

	return mutation
}
