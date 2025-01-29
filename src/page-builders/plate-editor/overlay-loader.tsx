import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import { Loader } from '@/components/loader'

export default function OverlayLoader() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const startOverlayLoading = useEpisodeIdStoreContext(
		useShallow((state) => state.startOverlayLoading)
	)

	if (!startOverlayLoading) {
		return null
	}

	return (
		<div className="fixed right-0 top-0 z-[99] flex size-full flex-col items-center justify-center gap-12 bg-background/60">
			<Loader />
			<h2 className="text-2xl font-semibold">
				Bitte warten Sie, wir speichern Ihre Inhalte.
			</h2>
		</div>
	)
}
