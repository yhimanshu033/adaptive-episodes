import { useParams } from 'next/navigation'
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

export default function useAdaptationMutation() {
	const params = useParams()
	const projectId = Number(params.id)
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
					project_id: projectId,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: ELanguage.ENGLISH,
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
				projectId: String(projectId),
			},
			delay: 10000,
			stop: (resp) => {
				console.log(resp)
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
			toast.success('Localization sheet fetched!')
		},
		onError: () => {
			toast.error('Localization failed!')
		},
		mutationKey: ['create-adaptation-ls', projectId],
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
					project_id: projectId,
					seq_no: selectedRowData.map((item) => item.seq_number),
					source_lang: ELanguage.ENGLISH,
					target_lang: language,
					type: 'adaptation',
				},
			}
		)
		console.log({ resp })
		if (resp.error || !resp.data) {
			throw new Error('Error during adaptation!')
		}

		return resp?.data
	}

	const sendLSMutation = useMutation({
		mutationFn: sendAdaptationLS,
		onSuccess: () => {
			toast.success('Adaptation registered!')
		},
		onError: () => {
			toast.error('Adaptation failed!')
		},
		mutationKey: ['send-adaptation-ls', projectId],
	})

	return { createLSMutation, sendLSMutation }
}
