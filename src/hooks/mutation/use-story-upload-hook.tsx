'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import {
	STORIES_QUERY_KEY,
	STORY_ID_QUERY_KEY,
	USER_PROJECTS_QUERY_KEY,
} from '@/constants/query-constants'
import { StoryImportFormSchema } from '@/hooks/form-resolvers/story-import-resolver'
import useSocket from '@/hooks/use-socket'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { uploadFile } from '@/server-action/file-upload'
import {
	setFullScreenLoading,
	setFullScreenLoadingMessage,
} from '@/store/global-store'
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
			queryKey: [STORY_ID_QUERY_KEY],
			type: 'all',
		})
		await queryClient.invalidateQueries({
			queryKey: [STORIES_QUERY_KEY],
			type: 'all',
		})
		await queryClient.invalidateQueries({
			queryKey: [USER_PROJECTS_QUERY_KEY],
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
			const { story_files, image_file, author, ...rest } = params

			const imagePromise = image_file
				? uploadFile(image_file)
				: Promise.resolve(null)

			const projectUrlsPromise =
				story_files?.length && story_files.length > 0
					? Promise.all(story_files.map((file) => uploadFile(file)))
					: Promise.resolve([])

			const [image, project_urls] = await Promise.all([
				imagePromise,
				projectUrlsPromise,
			])

			const payload = {
				...rest,
				project_urls: project_urls
					? project_urls
							.filter((result): result is { url: string } => !!result?.url)
							.map((result) => result.url)
					: null,
				image: image?.url || null,
				author: author || null,
				run_nwm: true,
				create_blank_project: !story_files || !story_files.length,
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

	async function storyUpdate(body: Partial<TStory>) {
		const resp = await fetchAPI<TNoParams, TIdParams, Partial<TStory>>({
			method: 'PATCH',
			url: API_URLS.PROJECT_UPDATE,
			body,
			urlParams: { id: String(id) },
		})

		if (resp.status !== 200) {
			throw new Error('Invalid format')
		}
		return resp.data
	}

	async function storyDelete({ id }: { id: number }) {
		const resp = await fetchAPI<TNoParams, { id: number }>({
			method: 'POST',
			url: API_URLS.PROJECT_DELETE,
			urlParams: { id },
		})

		if (!resp.success) {
			throw new Error('Project not deleted')
		}
		return resp.data
	}
	const storyUploadMutation = useMutation({
		mutationKey: ['storyUpload'],
		mutationFn: storyUpload,
		onSuccess,
	})

	const storyUpdateMutation = useMutation({
		mutationKey: ['storyUpdate'],
		mutationFn: storyUpdate,
		onSuccess,
		onError,
	})

	const storyDeleteMutation = useMutation({
		mutationKey: ['storyDelete'],
		mutationFn: storyDelete,
		onSuccess,
		onError,
	})

	useEffect(() => {
		setFullScreenLoading(storyDeleteMutation.isPending)
		setFullScreenLoadingMessage(
			storyDeleteMutation.isPending ? 'Deleting Story' : ''
		)
	}, [storyDeleteMutation.isPending])

	return { storyUploadMutation, storyUpdateMutation, storyDeleteMutation }
}
export default useStoryUploadHook
