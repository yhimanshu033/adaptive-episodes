import React from 'react'
import { NEXT_EP_EDITOR_ID } from '@/constants/editor-constants'
import useNextEpisodeContent from '@/hooks/query/use-next-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Plate } from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui/editor'
import Spinner from '@/components/ui/spinner'

import { EDualVIewMode } from '@/types/episode-type'

export default function NextEpisode() {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)
	const showNextEpisode = dualViewMode === EDualVIewMode.NEXT_EP

	if (!showNextEpisode) return null
	return <NextEpisodeEditor />
}

function NextEpisodeEditor() {
	const { data, isPending } = useNextEpisodeContent()

	const editor = useMyEditor({
		content: data?.text || '',
		id: NEXT_EP_EDITOR_ID,
		simplified: true,
	})

	if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2 py-12">
				<Spinner size={64} />
			</div>
		)
	}
	return (
		<Plate editor={editor}>
			<Editor focusRing={false} readOnly variant="ghost" size="md" />
		</Plate>
	)
}
