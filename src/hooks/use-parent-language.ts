import { useStoryIdData } from '@/hooks/query/use-story-data'

import { ELanguage } from '@/types/common'

export default function useParentLanguage() {
	const { data } = useStoryIdData()

	return {
		parentLanguage: data?.parent_language || ELanguage.GERMAN_ORIGINAL,
		sourceLanguage: data?.source_language,
	}
}
