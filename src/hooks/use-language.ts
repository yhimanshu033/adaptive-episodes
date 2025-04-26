import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

export default function useLanguage() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const selectedLanguage = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedLanguage)
	)
	const { language } = useEpisodeContent()

	return selectedLanguage || language
}
