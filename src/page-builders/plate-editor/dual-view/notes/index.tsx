'use client'

import React, { useEffect } from 'react'
import { useNotesData } from '@/hooks/query/use-notes-query'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import AddNotes from '@/page-builders/plate-editor/dual-view/notes/add-notes'
import NoteCard from '@/page-builders/plate-editor/dual-view/notes/note-card'
import NoteContent from '@/page-builders/plate-editor/dual-view/notes/note-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import { TNote } from '@/types/plate-types'

const Notes = () => {
	const { store } = useEpisodeIdStore()
	const activeNoteId = store((state) => state.activeNoteId)
	const { useEpisodeTableStore, setNotes } = useEpisodeStore()
	const notes = useEpisodeTableStore(useShallow((state) => state.notes))
	const { data, isLoading } = useNotesData()

	useEffect(() => {
		if (data && data.notes && !notes.length) {
			const fetchedNotes = Object.values(data.notes).map(
				({ note_text }) => JSON.parse(note_text) as TNote
			)
			if (fetchedNotes.length) {
				setNotes(fetchedNotes)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const RenderNotes = () => {
		if (isLoading) {
			return <DualViewLoader />
		}

		return (
			<div className="grid grid-cols-1 gap-4">
				<AddNotes />
				{notes.map((note) =>
					note.id === activeNoteId ? (
						<NoteContent
							key={note.id}
							activeNoteId={activeNoteId}
							notes={notes}
						/>
					) : (
						<NoteCard key={note.id} {...note} />
					)
				)}
			</div>
		)
	}

	return (
		<section className="mt-16 p-4">
			<RenderNotes />
		</section>
	)
}

export default Notes
