import React from 'react'
import { PlusIcon } from '@/icons/plus-icon'
import useEditorNoteStore from '@/store/edit-note-store'

import { Button } from '@/components/aural-ui/button'

const AddNotes = () => {
	const { setFormOpen } = useEditorNoteStore()

	const onClickAddNote = () => {
		setFormOpen(true)
	}

	return (
		<Button
			variant="outline"
			className="text-fm-secondary-800 w-full"
			innerClassName="border-fm-divider-secondary"
			onClick={onClickAddNote}
		>
			<PlusIcon /> Add new Notes
		</Button>
	)
}

export default AddNotes
