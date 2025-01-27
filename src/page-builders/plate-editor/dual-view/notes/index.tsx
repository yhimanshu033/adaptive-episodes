'use client'

import React from 'react'
import NoteCard from '@/page-builders/plate-editor/dual-view/notes/note-card'
import NoteContent from '@/page-builders/plate-editor/dual-view/notes/note-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

const Notes = () => {
	const { store } = usePlateStore()
	const activeNoteId = store((state) => state.activeNoteId)
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const notes = useEpisodeIdStoreContext(useShallow((state) => state.notes))

	const RenderNotes = () => {
		if (!notes || !notes.length) {
			return <p className="pt-12 text-center">No notes available</p>
		}

		if (activeNoteId) {
			return <NoteContent activeNoteId={activeNoteId} notes={notes} />
		}

		return (
			<div className="grid grid-cols-1 gap-4">
				{notes.map((note) => (
					<NoteCard key={note.id} {...note} />
				))}
			</div>
		)
	}

	return (
		<section className="p-4">
			<RenderNotes />
		</section>
	)
}

export default Notes
