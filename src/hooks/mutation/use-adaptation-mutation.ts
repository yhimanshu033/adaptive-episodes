import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import usePolling from '@/providers/polling-provider'
import { fetchAPI } from '@/lib/fetch-api'

import { TSendAdaptationStartBody } from '@/types/ai-types'
import { ELanguage, TNoParams } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

export default function useAdaptationMutation() {
	const params = useParams()
	const projectId = Number(params.id)
	const { data: session } = useSession()

	const { poll, stopPolling } = usePolling()
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
					target_lang: ELanguage.SPANISH,
					type: 'ls_sheet_gen',
				},
			}
		)

		const pollingKey = `adaptation-${projectId}-${language}-${selectedRowData.map((item) => item.seq_number).join('-')}`
		await poll({
			method: 'GET',
			url: '/',
			baseUrl: 'https://jsonplaceholder.typicode.com/todos/1',
			pollingKey,
			delay: 2000,
			onResponse: () => {
				stopPolling(pollingKey)
			},
		})

		if (resp.error || !resp.data) {
			toast.error('Error during adaptation!')
		}

		return resp.data
	}

	const mutation = useMutation({
		mutationFn: createAdaptation,
		onSuccess: () => {
			toast.success('Adaptation started successfully')
		},
		onError: () => {
			toast.error('Adaptation failed!')
		},
		mutationKey: ['adaptation', projectId],
	})

	return mutation
}
