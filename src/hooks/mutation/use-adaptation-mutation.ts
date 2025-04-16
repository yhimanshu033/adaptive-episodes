import { useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ELanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

export default function useAdaptationMutation() {
	const params = useParams()
	const projectId = Number(params.id)
	async function createAdaptation({
		language,
		selectedRowData,
	}: {
		language: ELanguage
		selectedRowData: TEpisode[]
	}) {
		console.log({ selectedRowData, language })
		await new Promise((resolve) => setTimeout(resolve, 4000)) // Simulating a network request
		return true
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
