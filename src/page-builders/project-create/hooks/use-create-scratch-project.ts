import { useRouter } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { useGlobalStore } from '@/store/global-store'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { fetchAPI } from '@/lib/fetch-api'

import { ELanguage, TNoParams, TSocketQueryParams } from '@/types/common'
import { StoryUploadParams, TUploadStoryResponse } from '@/types/story-types'

export default function useCreateScratchProject() {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const router = useRouter()
	async function createProjectFromScratch({
		language,
	}: {
		language: ELanguage
	}) {
		const taskId = nanoid()
		const data = await fetchAPI<
			TUploadStoryResponse,
			TNoParams,
			StoryUploadParams,
			TSocketQueryParams
		>({
			method: 'POST',
			url: API_URLS.STREAM_PROJECT_UPLOAD,
			body: {
				task_data: {
					author:
						userData?.user.fullname || userData?.user.firstname || 'Anonymous',
					input_language: language,
					title: 'Untitled',
					image: null,
					start_ep: 1,
					end_ep: 1,
					run_adaptation: false,
					llm_model: 'hybrid',
					run_nwm: false,
					project_urls: [],
					create_blank_project: true,
					from_scratch: true,
				},
			},
			query: {
				task_id: taskId,
			},
		})

		if (!data?.data?.project_id) {
			toast.error('Story creation failed!')
			return
		}

		router.replace(`/projects/${data?.data?.project_id}/onboard`)

		return data.data
	}

	const mutation = useMutation({
		mutationFn: createProjectFromScratch,
	})

	return mutation
}
