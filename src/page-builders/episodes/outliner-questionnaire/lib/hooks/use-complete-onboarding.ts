import { useRouter } from 'next/navigation'
import { EPISODE_SEQUENCE } from '@/constants/global-constants'
import { OUTLINER_QUESTIONNAIRE_NEW_IDEAS_QUERY_KEY } from '@/constants/query-constants'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import { useOutlinerQuestionnaireNewIdeasMutation } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-new-ideas'
import {
	TGetStoryIdeasResponse,
	TStoryIdeaData,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { inventEpisode } from '@/server-action/episode-action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useCompleteOnboarding() {
	const { storyUpdateMutation } = useStoryUploadHook()
	const { initialStoryData } = useEpisodeTableContext()
	const { mutateAsync: updateNewIdeas } =
		useOutlinerQuestionnaireNewIdeasMutation()
	const router = useRouter()
	const queryClient = useQueryClient()

	async function completeOnboarding({
		id,
		selectedIdea,
		title,
	}: {
		id: number
		selectedIdea: TStoryIdeaData
		title: string
	}) {
		const newIdeasPromise = updateNewIdeas({
			new_story_ideas: [selectedIdea],
		})
		const storyUpdatePromise = storyUpdateMutation.mutateAsync({
			project_title: title || 'Untitled',
			author: initialStoryData?.author,
			image: initialStoryData?.image,
		})
		const inventPromise = inventEpisode({
			project_id: Number(id),
			chapter_title: 'Episode 1',
			seq_number: 1,
			language: initialStoryData?.parent_language,
		})

		const [inventedEpisode] = await Promise.all([
			inventPromise,
			newIdeasPromise,
			storyUpdatePromise,
		])

		if (!inventedEpisode?.id) {
			toast.error('New chapter could not be created!')
			return
		}

		await queryClient.setQueryData(
			[OUTLINER_QUESTIONNAIRE_NEW_IDEAS_QUERY_KEY, Number(id)],
			() => {
				return {
					message: '',
					result: {
						new_story_ideas: [selectedIdea],
						project_id: id,
					},
					status: 1,
				} as TGetStoryIdeasResponse
			}
		)

		toast.success('Onboarding completed!')

		router.replace(
			`/projects/${String(id)}/${String(inventedEpisode?.id)}/content?${EPISODE_SEQUENCE}=${inventedEpisode.seq_number ?? 1}`
		)
		return inventedEpisode
	}

	const mutation = useMutation({
		mutationFn: completeOnboarding,
	})

	return mutation
}
