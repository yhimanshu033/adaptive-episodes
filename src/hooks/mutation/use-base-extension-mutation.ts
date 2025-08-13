import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import {
	BASE_EXTENSION_MUTATION,
	BASE_EXTENSION_QUERY_KEY,
} from '@/constants/query-constants'
import { uploadFile } from '@/server-action/file-upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TBaseScriptExtensionBody } from '@/types/admin-types'

import useAccessChecks from '../use-access-checks'
import useSocketStreaming from '../use-socket-streaming'

const useBaseExtensionMutation = () => {
	const { startTask } = useSocketStreaming()
	const { id } = useParams()
	const queryClient = useQueryClient()
	const { initialStoryData } = useEpisodeTableContext()
	const { setOpen, setFetchingLSSheet, setStory } = useAdaptation()
	const { isGerman, isOriginal } = useAccessChecks()

	const onSuccess = async () => {
		toast.success('Base script extension started ...')
		await queryClient.invalidateQueries({
			queryKey: [BASE_EXTENSION_QUERY_KEY, Number(id)],
		})
		if (!isGerman && isOriginal) {
			setOpen(true)
			setFetchingLSSheet(true)
			setStory(initialStoryData)
		}
	}

	const onError = () => {
		toast.error('Failed to upload file. Please try again.')
	}

	const onBaseExtensionMutation = async (
		params: TBaseScriptExtensionBody & { file?: File }
	) => {
		if (params.file) {
			const file_url = (await uploadFile(params.file))?.url
			if (!file_url) {
				throw new Error('Failed to upload file')
			}
			params.file_url = file_url
			delete params.file
		}
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
		onError,
	})

	return baseExtensionMutation
}

export default useBaseExtensionMutation
