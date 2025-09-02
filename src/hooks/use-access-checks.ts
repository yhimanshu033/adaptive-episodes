import { useCallback } from 'react'

import useEpisodeTableContext from '@/providers/episode-table-provider'

import { ELanguage } from '@/types/common'

const useAccessChecks = () => {
	const { initialStoryData } = useEpisodeTableContext()

	const isGerman = initialStoryData?.parent_language
		? initialStoryData.parent_language === ELanguage.GERMAN_ORIGINAL
		: false

	const isOriginal = initialStoryData?.is_original || false

	const isOriginalEp = useCallback(
		(lang?: ELanguage) => {
			return lang === initialStoryData?.parent_language
		},
		[initialStoryData]
	)

	return { isGerman, isOriginal, isOriginalEp }
}

export default useAccessChecks
