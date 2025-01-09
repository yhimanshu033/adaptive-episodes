'use client'

import { useParams } from 'next/navigation'
import { uploadFile } from '@/server-action/file-upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import { StoryUploadParams } from '@/types/story-types'

import { StoryImportFormSchema } from '../form-resolvers/story-import-resolver'
import useSocket from '../use-socket'
import { useToast } from '../use-toast'

const useStoryUploadHook = () => {
	const { startTask } = useSocket()
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const { id } = useParams()
	const onSuccess = () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setTimeout(async () => {
			await queryClient.invalidateQueries({
				queryKey: ['stories'],
				type: 'all',
			})
		}, 3000)
	}

	const onError = (error: Error) => {
		toast({
			title: "Error: couldn't able upload story",
			description: error.message,
			variant: 'destructive',
		})
	}

	async function storyUpload(params: StoryImportFormSchema) {
		try {
			const { story_file, image_file, author, ...rest } = params

			const [project_url, image] = await Promise.all([
				uploadFile(story_file),
				image_file ? uploadFile(image_file) : Promise.resolve(null),
			])
			const payload = {
				...rest,
				project_url: project_url?.url ?? null,
				image: image?.url ?? null,
				author: author ?? null,
			}

			const taskId = await startTask<StoryUploadParams>({
				method: 'POST',
				url: '/project/upload/',
				body: {
					task_data: { ...payload },
				},
			})
			return Promise.resolve(taskId)
		} catch (e) {
			console.log(e)
			throw e as Error
		}
	}
	const storyUploadMutation = useMutation({
		mutationKey: ['storyUpload'],
		mutationFn: storyUpload,
		onSuccess,
	})
	async function storyUpdate({ author }: { author: string }) {
		const resp = await fetchAPI<TNoParams, TNoParams, { author: string }>({
			method: 'PATCH',
			url: `/project/${String(id)}/`,
			body: { author },
		})
		return resp.data
	}
	const storyUpdateMutation = useMutation({
		mutationKey: ['storyUpdate'],
		mutationFn: storyUpdate,
		onSuccess,
		onError,
	})
	return { storyUploadMutation, storyUpdateMutation }
}
export default useStoryUploadHook
