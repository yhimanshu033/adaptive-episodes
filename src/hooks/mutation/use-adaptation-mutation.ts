import { API_URLS } from '@/constants/global-constants'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { doPoll } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'

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

function getSourceLanguage(selectedRowData: TEpisode[]) {
	const sourceLang = selectedRowData?.[0]?.language || ELanguage.ENGLISH_US

	if (sourceLang === ELanguage.ENGLISH) {
		return ELanguage.ENGLISH_US
	}
	return sourceLang
}

export default function useAdaptationMutation(onSuccess = () => {}) {
	const { data: session } = useSession()

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
					source_lang: getSourceLanguage(selectedRowData),
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
		language,
		selectedRowData,
		inputls,
	}: {
		inputls: LSMappingOutput
		language: ELanguage
		selectedRowData: TEpisode[]
	}) {
		const resp = await fetchAPI<TNoParams, TNoParams, TSendAdaptationStartBody>(
			{
				method: 'POST',
				url: API_URLS.SEND_TASK_TO_ADAPTATION,
				body: {
					author: session?.user?.fullname || '',
					inputls,
					is_external: true,
					project_id: selectedRowData?.[0]?.project,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: getSourceLanguage(selectedRowData),
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
		onSuccess: () => {
			onSuccess()
			toast.success('Adaptation registered!')
		},
		onError: () => {
			toast.error('Adaptation failed!')
		},
		mutationKey: ['send-adaptation-ls'],
	})

	return { createLSMutation, sendLSMutation }
}
