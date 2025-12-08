import useEpisodeContent from '@/hooks/query/use-episode-content'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { hasNWMRan } from '@/lib/utils/helpers'

export default function useIsInitial() {
	const { initialStoryData } = useEpisodeTableContext()
	const { data: episodeData } = useEpisodeContent()

	return (
		initialStoryData?.props?.from_scratch &&
		episodeData?.chapter.seq_number === 1 &&
		!hasNWMRan(episodeData?.chapter)
	)
}
