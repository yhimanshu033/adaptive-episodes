import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useOutlinerQuestionnaireEnabled() {
	const { initialStoryData } = useEpisodeTableContext()

	return (
		initialStoryData?.episode_count !== undefined &&
		initialStoryData?.episode_count <= 1
	)
}
