import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { EPISODE_REGENERATE_MUTATION_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { getEpisodeContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getText } from '@/lib/utils/plate'

import { TEpisodeRegenerateParams } from '@/types/beatsheet-editor-types'
import { ELanguage } from '@/types/common'

export const useEpisodeRegenerate = () => {
	const { startTask } = useSocket()
	const { id } = useParams()

	const onSuccess = () => {
		toast.success('Episode regeneration started ...')
	}

	const onEpisodeRegenerateMutation = async ({
		episodeId,
	}: {
		episodeId: number
	}) => {
		const episodeContent = await getEpisodeContent(episodeId)

		const params: TEpisodeRegenerateParams = {
			project_id: Number(id),
			chapter_id: episodeId,
			input_language:
				episodeContent?.chapter.language || ELanguage.GERMAN_ORIGINAL,
			ep_text: getText(episodeContent?.text || ''),
		}
		const taskId = await startTask<TEpisodeRegenerateParams>({
			method: 'POST',
			url: API_URLS.EPISODE_REGENERATE,
			body: params,
		})
		return taskId
	}

	const episodeRegenerateMutation = useMutation({
		mutationKey: [EPISODE_REGENERATE_MUTATION_KEY],
		mutationFn: onEpisodeRegenerateMutation,
		onSuccess,
	})

	return episodeRegenerateMutation
}
