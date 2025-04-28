import useEpisodeTableContext from '@/providers/episode-table-provider'

import { ELanguage } from '@/types/common'

export default function useParentLanguage() {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	return storyData?.parent_language || ELanguage.GERMAN_ORIGINAL
}
