import { useRouter } from 'next/navigation'
import { API_URLS, EPISODE_SEQUENCE } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSocket from '@/hooks/use-socket'
import { inventEpisode } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'
import { useEditorRef } from 'platejs/react'
import { toast } from 'sonner'

import { doPollFn } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'

import { TEpisodeRegenerateParams } from '@/types/beatsheet-editor-types'
import { ELanguage } from '@/types/common'
import {
	TGetEpisodeUrlParams,
	TGetNewEpisodeResponse,
} from '@/types/episode-type'

export function useUGCPublishMutation() {
	const { data: episodeData } = useEpisodeContent()
	const { startTask } = useSocket()
	const editor = useEditorRef()

	async function publishEpisode() {
		if (!episodeData?.chapter.id) {
			return
		}
		const params: TEpisodeRegenerateParams = {
			project_id: episodeData.chapter.project,
			chapter_id: episodeData.chapter.id,
			input_language: episodeData?.chapter.language || ELanguage.ENGLISH,
			ep_text: editor.api.string([]),
			episode_number: episodeData?.chapter.seq_number,
		}
		const taskId = await startTask<TEpisodeRegenerateParams>({
			method: 'POST',
			url: API_URLS.EPISODE_REGENERATE,
			body: params,
			throwOnError: true,
		})

		if (!taskId) {
			toast.error('Error in extracting context!')
			return
		}

		// check after 2 minutes
		const resp = await doPollFn({
			fn: async () => {
				const episode = await fetchAPI<
					TGetNewEpisodeResponse,
					TGetEpisodeUrlParams
				>({
					method: 'GET',
					url: API_URLS.GET_EPISODE,
					urlParams: {
						chapterId: episodeData.chapter.id,
					},
				})
				return episode.data
			},
			stop: (episode) => {
				if (!episode) {
					// some error has occurred. lets not poll further
					toast.error('Some error occurred!')
					return true
				}
				return episode?.chapter?.props?.nwm_running === false
			},
			delay: 30 * 1000,
			startDelay: 2 * 60 * 1000,
		})
		toast.success('Published Episode Successfully!')
		return resp
	}

	const mutation = useMutation({
		mutationFn: publishEpisode,
	})

	return mutation
}

export function useUGCInventMutation() {
	const { data: episodeData } = useEpisodeContent()
	const router = useRouter()

	async function inventUGCChapter() {
		if (!episodeData?.chapter.project) {
			return
		}
		const resp = await inventEpisode({
			project_id: episodeData?.chapter.project,
			chapter_title: `Episode ${episodeData.chapter.seq_number + 1}`,
			seq_number: episodeData.chapter.seq_number + 1,
			language: episodeData.chapter.language,
		})
		if (!resp?.id) {
			return
		}
		router.replace(
			`/projects/${resp.project_id}/${resp.id}/content/?${EPISODE_SEQUENCE}=${resp.seq_number}`
		)
	}

	const mutation = useMutation({
		mutationFn: inventUGCChapter,
		onError: () => {
			toast.error('Error in extracting context!')
		},
	})

	return mutation
}
