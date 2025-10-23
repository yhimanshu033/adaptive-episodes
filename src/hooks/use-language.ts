import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useEpisodeIdStore } from 'unified-editor'
import { useShallow } from 'zustand/react/shallow'

import { ELanguage } from '@/types/common'

export default function useLanguage() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const selectedLanguage = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedLanguage)
	)
	const { language } = useEpisodeContent()

	return selectedLanguage || language || ELanguage.GERMAN_ORIGINAL
}
