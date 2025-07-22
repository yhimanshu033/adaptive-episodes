import React from 'react'
import useNotes from '@/hooks/use-notes'
import useEpisodeIdStore from '@/store/episode-id-store'
import { nanoid } from '@udecode/plate'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { TNote } from '@/types/plate-types'

const AddNotes = () => {
	const { setActiveNoteId } = useEpisodeIdStore()
	const { handleAddNote } = useNotes()

	const onClickAddNote = () => {
		const id = nanoid()
		const newNote: TNote = {
			id,
			title: 'Untitled',
			edit: '',
			updateTime: new Date().toString(),
		}
		handleAddNote(newNote, true)
		setActiveNoteId(id)
	}

	return (
		<Button
			variant="outline"
			className="text-l w-full"
			onClick={onClickAddNote}
		>
			<Plus size={16} /> Add to Notes
		</Button>
	)
}

export default AddNotes
