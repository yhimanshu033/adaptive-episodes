import React from 'react'
import { useEpisodeIdStore } from 'unified-editor'
import { useShallow } from 'zustand/react/shallow'

import DotLoader from '@/components/aural-ui/dot-loader'

export default function EditorOverlayLoader() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const startOverlayLoading = useEpisodeIdStoreContext(
		useShallow((state) => state.startOverlayLoading)
	)

	if (!startOverlayLoading) {
		return null
	}

	return (
		<DotLoader
			text="Please wait, we are saving your content."
			classes={{
				root: 'fixed inset-0 z-10 justify-center bg-black/80',
				text: 'text-fm-primary',
			}}
		/>
	)
}
