import React from 'react'
import { PREV_EP_EDITOR_ID } from '@/constants/editor-constants'
import useMyEditor from '@/hooks/use-my-editor'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import { Plate } from 'platejs/react'

import { Editor } from '@/components/plate-ui-v2/editor'

export default function ContentDisplay({ content }: { content?: string }) {
	const editor = useMyEditor({
		content: content || '',
		id: PREV_EP_EDITOR_ID,
		simplified: true,
	})

	if (!content) {
		return <DualViewLoader />
	}
	return (
		<Plate editor={editor}>
			<Editor
				readOnly
				variant="aural"
				className="bg-fm-surface-primary text-fm-tertiary"
			/>
		</Plate>
	)
}
