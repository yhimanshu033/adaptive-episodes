import { useParams } from 'next/navigation'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { API_URLS } from '@/constants/global-constants'
import { EPISODE_REGENERATE_MUTATION_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { getEpisodeContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { track } from '@/lib/utils/analytics'
import { hasNWMRan } from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import { TEpisodeRegenerateParams } from '@/types/beatsheet-editor-types'
import { ELanguage } from '@/types/common'

export const useEpisodeRegenerate = () => {
	const { startTask } = useSocket()
	const { data: session } = useSession()
	const { id, episodeId: paramEpisodeId } = useParams()

	const onSuccess = (data: string | undefined) => {
		if (!data) {
			return
		}
		toast.success('Episode regeneration started ...')
	}

	const onEpisodeRegenerateMutation = async ({
		episodeId,
	}: {
		episodeId: number
	}) => {
		const episodeContent = await getEpisodeContent(episodeId)

		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: paramEpisodeId
				? SCREEN_NAME.EPISODE_EDITOR
				: SCREEN_NAME.EPISODE_LIST,
			metaData: {
				action: ACTION.RUN_NWM,
				chapterId: String(episodeId),
			},
		})

		if (hasNWMRan(episodeContent?.chapter)) {
			toast.warning('NWM has already ran on this episode!')
			return
		}

		if (
			!!episodeContent?.email &&
			episodeContent.email !== session?.user?.email
		) {
			toast.warning(`${episodeContent.email} is now editing the chapter!`)
			return
		}

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
