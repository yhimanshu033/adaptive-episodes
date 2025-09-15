import { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TDocxDownloadArgs } from '@/types/plate-types'

export default function useDocxDownloadParams(): TDocxDownloadArgs {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const title = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)
	const { data } = useEpisodeContentUtil()
	const epNumber = data?.chapter.seq_number ?? 0
	const { initialStoryData } = useEpisodeTableContext()
	const projectTitle = initialStoryData?.project_title ?? ''

	return {
		epNumber,
		title,
		projectTitle,
	}
}
