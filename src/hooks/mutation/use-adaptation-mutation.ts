import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { doPoll } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'
import { getSourceLanguage } from '@/lib/utils/helpers'

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

export default function useAdaptationMutation(onSuccess = () => {}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { id } = useParams()

	async function createAdaptation({
		language,
		selectedRowData,
	}: {
		language: ELanguage
		selectedRowData: TEpisode[]
	}) {
		const resp = await fetchAPI<TNoParams, TNoParams, TSendAdaptationStartBody>(
			{
				method: 'POST',
				url: API_URLS.SEND_TASK_TO_ADAPTATION,
				body: {
					author: session?.user?.fullname || '',
					inputls: {},
					is_external: true,
					project_id: selectedRowData?.[0]?.project,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: getSourceLanguage(selectedRowData[0]?.language),
					target_lang: language,
					type: 'ls_sheet_gen',
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
		})

		return pollingResp?.data
	}

	const createLSMutation = useMutation({
		mutationFn: createAdaptation,
		onSuccess: () => {
			onSuccess()
			toast.success('Localization sheet fetched!')
		},
		onError: () => {
			toast.error('Localization failed!')
		},
		mutationKey: ['create-adaptation-ls'],
	})

	async function sendAdaptationLS({
		sourceLang,
		language,
		selectedRowData,
		inputls,
		projectId,
	}: {
		inputls: LSMappingOutput
		language: ELanguage
		projectId: number
		selectedRowData: TEpisode[]
		sourceLang: ELanguage
	}) {
		console.log({
			author: session?.user?.fullname || '',
			inputls,
			is_external: true,
			project_id: projectId,
			seq_no: selectedRowData.map((item) => item.seq_number),
			source_lang: getSourceLanguage(sourceLang),
			target_lang: language,
			type: 'adaptation',
		})
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
					source_lang: getSourceLanguage(sourceLang),
					target_lang: language,
					type: 'adaptation',
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
		},
		onError: () => {
			toast.error('Adaptation failed!')
		},
		mutationKey: ['send-adaptation-ls'],
	})

	return { createLSMutation, sendLSMutation }
}
