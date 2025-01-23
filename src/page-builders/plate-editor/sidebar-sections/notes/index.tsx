'use client'

import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import usePlateStore from '@/store/plate-store'

import NoteCard from './note-card'
import NoteContent from './note-content'

const Notes = () => {
	const { store } = usePlateStore()
	const activeNoteId = store((state) => state.activeNoteId)
	const { data } = useEpisodeContent()
	const notes = data?.chapter.props?.notes

	const RenderNotes = () => {
		if (!notes || !notes.length) {
			return <p className="text-center">No notes available</p>
		}

		if (activeNoteId) {
			return <NoteContent activeNoteId={activeNoteId} notes={notes} />
		}

		return (
			<div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
				{notes.map((note) => (
					<NoteCard key={note.id} {...note} />
				))}
			</div>
		)
	}

	return (
		<section className="mx-auto max-w-2xl p-4">
			<h1 className="text-2xl font-bold">Notes</h1>
			<RenderNotes />
		</section>
	)
}

export default Notes
