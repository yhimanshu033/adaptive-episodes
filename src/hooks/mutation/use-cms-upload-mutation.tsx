import { API_URLS } from '@/constants/global-constants'
import {
	STORIES_QUERY_KEY,
	UPLOAD_CMS_SHOW_MUTATION_KEY,
	USER_PROJECTS_QUERY_KEY,
} from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TCMSShowUploadBody } from '@/types/story-types'

const useCMSUploadMutation = () => {
	const { startTask } = useSocket()
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
		const taskId = await startTask<TCMSShowUploadBody>({
			method: 'POST',
			url: API_URLS.UPLOAD_CMS_SHOW,
			body,
		})
		return taskId
	}

	const cmsUploadMutation = useMutation({
		mutationKey: [UPLOAD_CMS_SHOW_MUTATION_KEY],
		mutationFn: onCMSUploadMutation,
		onSuccess,
		onError: () => {
			toast.error('Error uploading CMS show')
		},
	})

	return cmsUploadMutation
}

export default useCMSUploadMutation
