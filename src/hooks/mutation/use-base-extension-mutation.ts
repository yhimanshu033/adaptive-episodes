import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BASE_EXTENSION_MUTATION } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TBaseScriptExtensionBody } from '@/types/admin-types'

import useSocket from '../use-socket'

const useBaseExtensionMutation = () => {
	const { startTask, getResponse } = useSocket()
	const { id } = useParams()

	const onSuccess = () => {
		toast.success('Base script extension started ...')
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
		const resp = await getResponse<{ message: string }>(taskId)
		return resp
	}

	const baseExtensionMutation = useMutation({
		mutationKey: [BASE_EXTENSION_MUTATION, Number(id)],
		mutationFn: onBaseExtensionMutation,
		onSuccess,
	})

	return baseExtensionMutation
}

export default useBaseExtensionMutation
