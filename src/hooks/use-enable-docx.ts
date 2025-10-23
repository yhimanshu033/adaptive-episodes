import { useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsGerman from '@/hooks/use-is-german'
import { useEpisodeIdStore } from 'unified-editor'
import { useShallow } from 'zustand/react/shallow'

import { EStatus } from '@/types/common'

export default function useEnableDocx() {
	const { latestStatus, data } = useEpisodeContent()
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()

	const seq_nos = useMemo(() => {
		return [data?.chapter?.seq_number || 1]
	}, [data?.chapter?.seq_number])

	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)
	const isGerman = useIsGerman()

	const downloadDocxEnabled = useMemo(() => {
		return (
			latestStatus === EStatus.PUBLISHED ||
			selectedStatus === EStatus.PUBLISHED ||
			!isGerman
		)
	}, [latestStatus, selectedStatus, isGerman])
	return {
		downloadDocxEnabled,
		seq_nos,
	}
}
