import React from 'react'
import { useParams } from 'next/navigation'
import { ELLMModel } from '@/constants/episodes-constants'
import { API_URLS } from '@/constants/global-constants'
import {
	EPISODE_LIST_QUERY_KEY,
	STORY_ID_QUERY_KEY,
} from '@/constants/query-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { doPoll } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'
import { migrateOldLSMapping } from '@/lib/utils/helpers'

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
	abortController,
}: {
	abortController?: AbortController
	onSuccess?: () => void
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { id } = useParams()

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
		/**
		 * test
		 */
		// return migrateOldLSMapping({ ls_mapping: sampleData2 })
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
			stop: (resp) => {
				if (!resp.error && resp.data) {
					return true
				}
				return false
			},
			signal: abortController?.signal,
		})

		const migratedData = migrateOldLSMapping(pollingResp?.data)

		return migratedData
	}

	const createLSMutation = useMutation({
		mutationFn: createAdaptation,
		onSuccess: () => {
			onSuccess()
			toast.success('Localization sheet fetched!', {
				icon: <BubbleCheckIcon />,
			})
		},
		onError: (error: Error) => {
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
	}: {
		inputls: LSMappingOutput
		language: ELanguage
		llmModel: ELLMModel
		projectId: number
		selectedRowData: TEpisode[]
		sourceLang: ELanguage
	}) {
		const resp = await fetchAPI<TNoParams, TNoParams, TSendAdaptationStartBody>(
			{
				method: 'POST',
				url: API_URLS.SEND_TASK_TO_ADAPTATION,
				body: {
					author: session?.user?.fullname || '',
					inputls,
					is_external: true,
					project_id: projectId,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: sourceLang || ELanguage.ENGLISH,
					target_lang: language,
					type: 'adaptation',
					llm_model: llmModel,
				},
			}
		)
		if (resp.error || !resp.data) {
			throw new Error('Error during adaptation!')
		}

		return resp?.data
	}

	const sendLSMutation = useMutation({
		mutationFn: sendAdaptationLS,
		onSuccess: async () => {
			onSuccess()
			toast.success('Adaptation registered!')
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
			})
			await queryClient.invalidateQueries({
				queryKey: [STORY_ID_QUERY_KEY, Number(id)],
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
