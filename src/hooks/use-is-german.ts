import useEpisodeTableContext from '@/providers/episode-table-provider'

import { ELanguage } from '@/types/common'

export default function useIsGerman() {
	const { initialStoryData } = useEpisodeTableContext()

	return initialStoryData?.parent_language
		? initialStoryData.parent_language === ELanguage.GERMAN_ORIGINAL
		: true
}
