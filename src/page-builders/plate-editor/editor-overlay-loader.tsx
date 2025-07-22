import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import { FullScreenLoader } from '@/components/loader'

export default function EditorOverlayLoader() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const startOverlayLoading = useEpisodeIdStoreContext(
		useShallow((state) => state.startOverlayLoading)
	)

	if (!startOverlayLoading) {
		return null
	}

	return (
		<FullScreenLoader
			loaderClass="fixed right-0 top-0 z-[99] flex size-full items-center justify-center gap-12 bg-background/60"
			textClass="text-2xl font-semibold"
			text="Please wait, we are saving your content."
		/>
	)
}
