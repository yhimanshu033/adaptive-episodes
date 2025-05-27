import React from 'react'
import { NOTE_EDITOR_BASE_ID } from '@/constants/editor-constants'
import useMyEditor from '@/hooks/use-my-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Value } from '@udecode/plate'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'
import FixedToolbarComponent from '@/components/plate-ui/fixed-toolbar-component'

const EditNote = ({
	content,
	editorRef,
}: {
	content: string
	editorRef: React.MutableRefObject<Value | null>
}) => {
	const { store } = useEpisodeIdStore()
	const activeNoteId = store((state) => state.activeNoteId)
	const editor = useMyEditor({
		content,
		id: `${NOTE_EDITOR_BASE_ID}-${activeNoteId}`,
		simplified: true,
	})
	return (
		<Plate
			editor={editor}
			onValueChange={({ value }) => {
				editorRef.current = value
			}}
		>
			<FixedToolbarComponent simplified className="z-0 rounded-sm py-1" />
			<Editor focusRing={false} size="md" className="min-h-24 pt-0!" />
		</Plate>
	)
}

EditNote.displayName = 'EditNote'

export default EditNote
