'use client'

import { uploadFile } from '@/server-action/file-upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { StoryUploadParams } from '@/types/story-types'

import { StoryImportFormSchema } from '../form-resolvers/story-import-resolver'
import useSocket from '../use-socket'

const useStoryUploadHook = () => {
	const { startTask } = useSocket()
	const queryClient = useQueryClient()

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: ['stories'],
			type: 'all',
		})
	}

	async function storyUpload(params: StoryImportFormSchema) {
		const { story_file, image_file, ...rest } = params

		console.log('Params', params)
		const [project_url, image] = await Promise.all([
			uploadFile(story_file),
			image_file && uploadFile(image_file),
		])
		const payload = {
			...rest,
			project_url: project_url?.url || '',
			image: image?.url || '',
		}

		console.log('response body', {
			task_data: { ...payload },
		})

		const taskId = await startTask<StoryUploadParams>({
			method: 'POST',
			url: '/project/upload/',
			body: {
				task_data: { ...payload },
			},
		})
		console.log('taskId', taskId)
		return taskId
	}
	const storyUploadMutation = useMutation({
		mutationKey: ['storyUpload'],
		mutationFn: storyUpload,
		onSuccess,
	})
	return { storyUploadMutation }
}
export default useStoryUploadHook
