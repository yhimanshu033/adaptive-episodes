import { API_URLS } from '@/constants/global-constants'
import {
	STORIES_QUERY_KEY,
	UPLOAD_CMS_SHOW_MUTATION_KEY,
	USER_PROJECTS_QUERY_KEY,
} from '@/constants/query-constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import {
	TCMSShowUploadBody,
	TCMSUploadFailedResponse,
} from '@/types/story-types'

const useCMSUploadMutation = () => {
	const queryClient = useQueryClient()

	const onSuccess = () => {
		toast.success('CMS show import started!')
		setTimeout(() => {
			void queryClient.invalidateQueries({
				queryKey: [STORIES_QUERY_KEY],
				type: 'all',
			})
			void queryClient.invalidateQueries({
				queryKey: [USER_PROJECTS_QUERY_KEY],
				type: 'all',
			})
		}, 1000)
	}

	const onCMSUploadMutation = async (body: TCMSShowUploadBody) => {
		const taskId = nanoid()
		const response = await fetchAPI<
			TNoParams,
			TNoParams,
			TCMSShowUploadBody,
			{ room_id: string; task_id: string },
			TCMSUploadFailedResponse
		>({
			method: 'POST',
			url: API_URLS.UPLOAD_CMS_SHOW,
			body,
			query: {
				task_id: taskId,
				room_id: 'true',
			},
		})

		if (!response?.success) {
			throw new Error(response.message?.error || 'Error uploading CMS show')
		}

		return response?.data
	}

	const cmsUploadMutation = useMutation({
		mutationKey: [UPLOAD_CMS_SHOW_MUTATION_KEY],
		mutationFn: onCMSUploadMutation,
		onSuccess,
		onError: (error) => {
			toast.error(error.message || 'Error uploading CMS show')
		},
	})

	return cmsUploadMutation
}

export default useCMSUploadMutation
