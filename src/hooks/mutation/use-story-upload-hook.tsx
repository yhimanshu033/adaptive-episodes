'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import { STORY_ID_QUERY_KEY } from '@/constants/query-constants'
import { StoryImportFormSchema } from '@/hooks/form-resolvers/story-import-resolver'
import useSocket from '@/hooks/use-socket'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { uploadFile } from '@/server-action/file-upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import { StoryUploadParams, TStory } from '@/types/story-types'

const useStoryUploadHook = () => {
	const { startTask } = useSocket()
	const queryClient = useQueryClient()
	const { id } = useParams()

	const onSuccess = async () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		await queryClient.invalidateQueries({
			queryKey: [STORY_ID_QUERY_KEY, Number(id)],
			type: 'all',
		})
		toast.success('Story details updated successfully')
	}

	const onError = (error: Error) => {
		toast.error('Error: Please check story format!', {
			description: error.message,
			icon: <BubbleCrossedIcon />,
		})
	}

	async function storyUpload(params: StoryImportFormSchema) {
		try {
			const { story_file, image_file, author, ...rest } = params

			const [project_url, image] = await Promise.all([
				story_file ? uploadFile(story_file) : Promise.resolve(null),
				image_file ? uploadFile(image_file) : Promise.resolve(null),
			])

			const payload = {
				...rest,
				project_url: project_url?.url || null,
				image: image?.url || null,
				author: author || null,
				create_blank_project: !story_file,
			}

			const taskId = await startTask<StoryUploadParams>({
				method: 'POST',
				url: API_URLS.STREAM_PROJECT_UPLOAD,
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

	async function storyUpdate(body: Partial<TStory>) {
		console.log({ body: body })
		const resp = await fetchAPI<TNoParams, TIdParams, Partial<TStory>>({
			method: 'PATCH',
			url: API_URLS.PROJECT_UPDATE,
			body,
			urlParams: { id: String(id) },
		})

		if (resp.status !== 200) {
			throw new Error('Invalid format')
		}
		console.log({ data: resp.data })
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
