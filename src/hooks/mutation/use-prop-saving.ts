import useEpisodeContent from '@/hooks/query/use-episode-content'
import useHandleSavingResponse from '@/hooks/use-handle-saving-response'
import { saveContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

import { DeepPartial, TEpisode } from '@/types/episode-type'

export default function useChapterPropsMutation() {
	const { data } = useEpisodeContent()

	const { handleSavingResponse } = useHandleSavingResponse()

	async function updateProps(body: DeepPartial<TEpisode>) {
		// nothing to save
		if (Object.keys(body || {}).length === 0) {
			return true
		}

		if (!data?.chapter.id || !data?.chapter?.project) {
			return false
		}

		const response = await saveContent({
			episodeId: data.chapter.parent || data.chapter.id,
			id: data.chapter.id,
			projectId: data.chapter.project,
			status: data.chapter.status,
			language: data.chapter.language,
			...body,
		})
		handleSavingResponse({ response })
		return response.success
	}

	const mutation = useMutation({
		mutationFn: updateProps,
	})

	return mutation
}
