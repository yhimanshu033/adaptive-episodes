'use client'

import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import { ENotesAction } from '@/types/episode-type'
import { TNote } from '@/types/plate-types'

import useNotesMutation from './mutation/use-notes-mutation'

const useNotes = () => {
	const updateNotesMutation = useNotesMutation()
	const { useEpisodeTableStore, updateNote, addNote, deleteNote } =
		useEpisodeStore()
	const notes = useEpisodeTableStore(useShallow((state) => state.notes))

	const handleUpdateNotes = (noteId: string, params: Partial<TNote>) => {
		const targetedNote = notes.find((note) => note.id === noteId)
		if (!targetedNote) return
		updateNote(noteId, params)
		updateNotesMutation.mutate({
			action: ENotesAction.UPDATE,
			unique_id: noteId,
			note_text: JSON.stringify({ ...targetedNote, ...params }),
		})
	}

	const handleAddNote = (note: TNote, addToStart?: boolean) => {
		addNote(note, addToStart)
		updateNotesMutation.mutate({
			action: ENotesAction.CREATE,
			unique_id: note.id,
			note_text: JSON.stringify(note),
		})
	}

	const handleDeleteNote = (noteId: string) => {
		deleteNote(noteId)
		updateNotesMutation.mutate({
			action: ENotesAction.DELETE,
			unique_id: noteId,
		})
	}

	return {
		handleUpdateNotes,
		handleAddNote,
		handleDeleteNote,
		isPending: updateNotesMutation.isPending,
	}
}
export default useNotes
