import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import {
	TGenerateOutlinerSurveyOptionsBody,
	TGenerateOutlinerSurveyOptionsResponse,
	TGetOutlinerQuestionnaireSurveyResponse,
	TSaveOutlinerSurveyQuestionBody,
	TSaveOutlinerSurveyQuestionResponse,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export function useOutlinerQuestionnaireSurveyQuestions() {
	async function getOutlinerSurveyQuestions() {
		const resp = await fetchAPI<TGetOutlinerQuestionnaireSurveyResponse>({
			method: 'GET',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS,
		})

		return resp.data
	}

	const query = useQuery({
		queryKey: [OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS_QUERY_KEY],
		queryFn: getOutlinerSurveyQuestions,
	})

	return query
}

export function useOutlinerQuestionnaireSurveyQuestionsMutation() {
	async function getOutlinerSurveyQuestions(
		body: TSaveOutlinerSurveyQuestionBody
	) {
		const resp = await fetchAPI<
			TSaveOutlinerSurveyQuestionResponse,
			TNoParams,
			TSaveOutlinerSurveyQuestionBody
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS_SUBMIT,
			body,
		})

		return resp.data
	}

	const mutation = useMutation({
		mutationFn: getOutlinerSurveyQuestions,
	})

	return mutation
}

export function useOutlinerQuestionnaireSurveyGenerateOptionsMutation() {
	const { startTask, getResponse } = useSocket()
	async function generateOutlinerSurveyOptions(
		body: TGenerateOutlinerSurveyOptionsBody
	) {
		const taskId = await startTask<TGenerateOutlinerSurveyOptionsBody>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_NEW_SHOWS_GENERATE,
			body,
		})

		const resp: TGenerateOutlinerSurveyOptionsResponse =
			await getResponse(taskId)
		return resp
	}

	const mutation = useMutation({
		mutationFn: generateOutlinerSurveyOptions,
	})

	return mutation
}
