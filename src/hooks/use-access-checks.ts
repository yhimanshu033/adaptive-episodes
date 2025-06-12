import useEpisodeTableContext from '@/providers/episode-table-provider'

import { ELanguage } from '@/types/common'

const useAccessChecks = () => {
	const { initialStoryData } = useEpisodeTableContext()

	const isGerman = initialStoryData?.parent_language
		? initialStoryData.parent_language === ELanguage.GERMAN_ORIGINAL
		: true

	const isOriginal = initialStoryData?.is_original || false

	return { isGerman, isOriginal }
}

export default useAccessChecks
