import useEpisodeContent from '@/hooks/query/use-episode-content'
import useHandleSavingResponse from '@/hooks/use-handle-saving-response'
import { saveContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

export default function useChapterTitleMutation() {
	const { data } = useEpisodeContent()

	const { handleSavingResponse } = useHandleSavingResponse()
	async function updateTitle({ title }: { title: string }) {
		if (!data?.chapter.id || !data?.chapter?.project || !title.trim()) {
			return
		}

		const response = await saveContent({
			episodeId: data.chapter.parent || data.chapter.id,
			id: data.chapter.id,
			projectId: data.chapter.project,
			status: data.chapter.status,
			language: data.chapter.language,
			chapter_title: title,
		})
		handleSavingResponse({ response })
		return response.data
	}

	const mutation = useMutation({
		mutationFn: updateTitle,
	})

	return mutation
}
