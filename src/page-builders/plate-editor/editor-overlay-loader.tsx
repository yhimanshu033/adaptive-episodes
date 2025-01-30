import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import OverlayLoader from '@/components/overlay-loader'

export default function EditorOverlayLoader() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const startOverlayLoading = useEpisodeIdStoreContext(
		useShallow((state) => state.startOverlayLoading)
	)

	if (!startOverlayLoading) {
		return null
	}

	return <OverlayLoader />
}
