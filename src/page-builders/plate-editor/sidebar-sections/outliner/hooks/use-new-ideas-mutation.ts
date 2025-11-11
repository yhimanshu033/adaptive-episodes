import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_NEW_IDEA_MUTATION_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TOutlinerChatGetNewIdeasUrlParams,
	TOutlinerChatUpdateNewIdeasBody,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useNewIdeasSaving() {
	const { data } = useEpisodeContent()

	async function updateSavedNewIdeas(body: TOutlinerChatUpdateNewIdeasBody) {
		if (isNaN(Number(data?.chapter.id))) {
			toast.error('Could not Update New Ideas')
			return
		}
		await fetchAPI<
			TNoParams,
			TOutlinerChatGetNewIdeasUrlParams,
			TOutlinerChatUpdateNewIdeasBody
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_NEW_IDEAS,
			body,
			urlParams: {
				episodeId: data?.chapter.id || 0,
			},
		})
	}

	const mutation = useMutation({
		mutationFn: updateSavedNewIdeas,
		mutationKey: [OUTLINER_NEW_IDEA_MUTATION_KEY, data?.chapter.id],
	})

	return mutation
}
