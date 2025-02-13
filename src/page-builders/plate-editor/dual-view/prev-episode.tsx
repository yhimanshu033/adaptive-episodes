import React from 'react'
import { PREV_EP_EDITOR_ID } from '@/constants/editor-constants'
import usePreviousEpisodeContent from '@/hooks/query/use-prev-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { Plate } from '@udecode/plate-common/react'

import { Loader } from '@/components/loader'
import { Editor } from '@/components/plate-ui/editor'

export default function PreviousEpisode() {
	const { data, isPending } = usePreviousEpisodeContent()

	const editor = useMyEditor({
		content: data?.text || '',
		id: PREV_EP_EDITOR_ID,
		simplified: true,
	})

	if (isPending) {
		return (
			<div className="sticky top-0 flex h-[calc(100svh_-_44px)] flex-col items-center justify-center">
				<Loader />
			</div>
		)
	}
	return (
		<Plate editor={editor}>
			<Editor focusRing={false} readOnly variant="ghost" size="md" />
		</Plate>
	)
}
