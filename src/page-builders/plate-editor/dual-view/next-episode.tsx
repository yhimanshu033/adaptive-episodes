import React from 'react'
import { NEXT_EP_EDITOR_ID } from '@/constants/editor-constants'
import useNextEpisodeContent from '@/hooks/query/use-next-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'

export default function NextEpisode() {
	const { data, isPending } = useNextEpisodeContent()

	const editor = useMyEditor({
		content: data?.text || '',
		id: NEXT_EP_EDITOR_ID,
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
				className="!pt-0"
			/>
		</Plate>
	)
}
