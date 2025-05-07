import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import {
	BASE_EXTENSION_MUTATION,
	BASE_EXTENSION_QUERY_KEY,
} from '@/constants/query-constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TBaseScriptExtensionBody } from '@/types/admin-types'

import useSocketStreaming from '../use-socket-streaming'

const useBaseExtensionMutation = () => {
	const { startTask } = useSocketStreaming()
	const { id } = useParams()
	const queryClient = useQueryClient()

	const onSuccess = async () => {
		toast.success('Base script extension started ...')
		await queryClient.invalidateQueries({
			queryKey: [BASE_EXTENSION_QUERY_KEY, Number(id)],
		})
	}

	const onBaseExtensionMutation = async (params: TBaseScriptExtensionBody) => {
		const taskId = await startTask<
			TBaseScriptExtensionBody,
			{ message: string }
		>({
			method: 'POST',
			url: API_URLS.EXTEND_BASE_SCRIPT,
			body: params,
		})
		return taskId
	}

	const baseExtensionMutation = useMutation({
		mutationKey: [BASE_EXTENSION_MUTATION, Number(id)],
		mutationFn: onBaseExtensionMutation,
		onSuccess,
	})

	return baseExtensionMutation
}

export default useBaseExtensionMutation
