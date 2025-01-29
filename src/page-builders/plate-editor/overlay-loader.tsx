import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import Spinner from '@/components/ui/spinner'

export default function OverlayLoader() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const startOverlayLoading = useEpisodeIdStoreContext(
		useShallow((state) => state.startOverlayLoading)
	)

	if (!startOverlayLoading) {
		return null
	}

	return (
		<div className="fixed right-0 top-0 z-[99] flex size-full items-center justify-center gap-6 bg-background/60">
			<h2 className="text-3xl font-semibold">
				Bitte warten Sie, wir speichern Ihre Inhalte
			</h2>
			<Spinner size={64} />
		</div>
	)
}
