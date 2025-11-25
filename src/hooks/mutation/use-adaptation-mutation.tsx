import React from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { ELLMModel } from '@/constants/episodes-constants'
import { API_URLS } from '@/constants/global-constants'
import {
	EPISODE_LIST_QUERY_KEY,
	GET_LS_SHEET_QUERY_KEY,
	STORY_ID_QUERY_KEY,
} from '@/constants/query-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { doPoll } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'
import { track } from '@/lib/utils/analytics'
import { migrateOldLSMapping, sanitize } from '@/lib/utils/helpers'

import {
	TGetAdaptationLSUrlParams,
	TSendAdaptationStartBody,
} from '@/types/ai-types'
import {
	ELanguage,
	LSMappingInput,
	LSMappingOutput,
	TNoParams,
} from '@/types/common'
import { TEpisode } from '@/types/episode-type'
import { TStory } from '@/types/story-types'

export default function useAdaptationMutation({
	onSuccess = () => {},
	abortControllerRef,
}: {
	abortControllerRef?: React.RefObject<AbortController | null>
	onSuccess?: () => void
}) {
	const { data: session } = useSession()
	const { id: projectId } = useParams()
	const queryClient = useQueryClient()

	async function createAdaptation({
		language,
		selectedRowData,
		storyData,
		currentLanguage,
		llmModel,
	}: {
		currentLanguage?: ELanguage
		language: ELanguage
		llmModel: ELLMModel
		selectedRowData: TEpisode[]
		storyData?: TStory | null
	}) {
		const resp = await fetchAPI<TNoParams, TNoParams, TSendAdaptationStartBody>(
			{
				method: 'POST',
				url: API_URLS.SEND_TASK_TO_ADAPTATION,
				body: {
					author: session?.user?.fullname || '',
					inputls: {},
					is_external: true,
					project_id: storyData?.id || selectedRowData[0].project,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: currentLanguage || ELanguage.ENGLISH,
					target_lang: language,
					type: 'ls_sheet_gen',
					llm_model: llmModel,
				},
			}
		)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.ADAPTATION_DIALOG,
			metaData: {
				action: ACTION.ADAPTATION_LS_GEN,
				sourceLang: currentLanguage || ELanguage.ENGLISH,
				targetLang: language,
				llmModel,
			},
		})
		if (resp.error || !resp.data) {
			throw new Error('Error during adaptation!')
		}
		const pollingResp = await doPoll<
			TNoParams,
			LSMappingInput,
			TGetAdaptationLSUrlParams
		>({
			method: 'GET',
			url: API_URLS.GET_ADAPTATION_LS,
			urlParams: {
				language,
				projectId: String(selectedRowData?.[0]?.project),
			},
			delay: 10000,
			startDelay: 1000 * 60,
			stop: (resp) => {
				if (!resp.error && resp.data) {
					return true
				}
				return false
			},
			signal: abortControllerRef?.current?.signal,
		})

		if (!pollingResp) {
			throw new Error('LS sheet not found!')
		}

		const migratedData = migrateOldLSMapping(pollingResp?.data)

		return migratedData
	}

	const createLSMutation = useMutation({
		mutationFn: createAdaptation,
		onSuccess: async () => {
			onSuccess()
			toast.success('Localization sheet fetched!', {
				icon: <BubbleCheckIcon />,
			})
			await queryClient.invalidateQueries({
				queryKey: [GET_LS_SHEET_QUERY_KEY, projectId],
			})
		},
		onError: (error: Error) => {
			if (abortControllerRef?.current) {
				abortControllerRef.current = new AbortController()
			}
			toast.error(error.message || 'Localization Failed!', {
				icon: <BubbleCrossedIcon />,
			})
		},
		mutationKey: ['create-adaptation-ls'],
	})

	async function sendAdaptationLS({
		sourceLang,
		language,
		selectedRowData,
		inputls,
		projectId,
		llmModel,
		skip_extraction,
	}: {
		inputls: LSMappingOutput
		language: ELanguage
		llmModel: ELLMModel
		projectId: number
		selectedRowData: TEpisode[]
		skip_extraction?: boolean
		sourceLang: ELanguage
	}) {
		const body: TSendAdaptationStartBody = {
			author: session?.user?.fullname || '',
			inputls,
			is_external: true,
			project_id: projectId,
			seq_no: selectedRowData.map((item) => item.seq_number),
			source_lang: sourceLang || ELanguage.ENGLISH,
			target_lang: language,
			type: 'adaptation',
			llm_model: llmModel,
			skip_extraction,
		}
		const sanitizedBody = sanitize(body)

		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.ADAPTATION_DIALOG,
			metaData: {
				action: ACTION.ADAPTATION_LS_SEND,
				sourceLang: sourceLang || ELanguage.ENGLISH,
				targetLang: language,
				llmModel,
			},
		})

		const resp = await fetchAPI<TNoParams, TNoParams, TSendAdaptationStartBody>(
			{
				method: 'POST',
				url: API_URLS.SEND_TASK_TO_ADAPTATION,
				body: sanitizedBody,
			}
		)
		if (resp.error || !resp.data) {
			throw new Error('Error during adaptation!')
		}

		return resp?.data
	}

	const sendLSMutation = useMutation({
		mutationFn: sendAdaptationLS,
		onSuccess: async (_, { projectId }) => {
			onSuccess()
			toast.success('Adaptation registered!')
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, projectId],
			})
			await queryClient.invalidateQueries({
				queryKey: [STORY_ID_QUERY_KEY, projectId],
			})
		},
		onError: () => {
			toast.error('Adaptation failed!', {
				icon: <BubbleCrossedIcon />,
			})
		},
		mutationKey: ['send-adaptation-ls'],
	})

	return { createLSMutation, sendLSMutation }
}
