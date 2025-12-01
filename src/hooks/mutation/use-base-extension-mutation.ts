import { useParams } from 'next/navigation'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { API_URLS } from '@/constants/global-constants'
import {
	BASE_EXTENSION_MUTATION,
	BASE_EXTENSION_QUERY_KEY,
	GET_LS_SHEET_QUERY_KEY,
} from '@/constants/query-constants'
import { uploadFile } from '@/server-action/file-upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { track } from '@/lib/utils/analytics'

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
		await queryClient.invalidateQueries({
			queryKey: [GET_LS_SHEET_QUERY_KEY, id],
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
		params: TBaseScriptExtensionBody & { files?: File[] }
	) => {
		if (params.files && params.files.length > 0) {
			const fileUploadPromises = params.files.map((file) => uploadFile(file))
			const uploadResults = await Promise.all(fileUploadPromises)

			const file_urls = uploadResults
				.map((result) => result?.url)
				.filter(Boolean) as string[]
			if (file_urls.length !== params.files.length) {
				throw new Error('Failed to upload one or more files')
			}

			params.file_urls = file_urls
			delete params.files
		}
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_LIST,
			metaData: {
				action: ACTION.BASE_SCRIPT_EXTENSION,
				size: String(
					(params?.ranges?.de_end ?? 0) - (params?.ranges?.de_start ?? 1) + 1
				),
			},
		})
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
