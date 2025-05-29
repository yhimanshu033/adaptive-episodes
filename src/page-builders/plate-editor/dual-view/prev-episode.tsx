import React from 'react'
import { PREV_EP_EDITOR_ID } from '@/constants/editor-constants'
import usePreviousEpisodeContent from '@/hooks/query/use-prev-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'

export default function PreviousEpisode() {
	const { data, isPending } = usePreviousEpisodeContent()

	const editor = useMyEditor({
		content: data?.text || '',
		id: PREV_EP_EDITOR_ID,
		simplified: true,
	})

	if (isPending) {
		return <DualViewLoader />
	}
	return (
		<Plate editor={editor}>
			<Editor
				focusRing={false}
				readOnly
				variant="ghost"
				size="md"
				className="py-[126px] opacity-75"
			/>
		</Plate>
	)
}
