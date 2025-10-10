'use client'

import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import { track } from '@/lib/utils/analytics'

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
		if (!targetedNote) {
			return
		}
		updateNote(noteId, params)
		updateNotesMutation.mutate({
			action: ENotesAction.UPDATE,
			unique_id: noteId,
			note_text: JSON.stringify({ ...targetedNote, ...params }),
		})
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.NOTES_UPDATE,
			},
		})
	}

	const handleAddNote = (note: TNote, addToStart?: boolean) => {
		addNote(note, addToStart)
		updateNotesMutation.mutate({
			action: ENotesAction.CREATE,
			unique_id: note.id,
			note_text: JSON.stringify(note),
		})
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.NOTES_ADD,
			},
		})
	}

	const handleDeleteNote = (noteId: string) => {
		deleteNote(noteId)
		updateNotesMutation.mutate({
			action: ENotesAction.DELETE,
			unique_id: noteId,
		})
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.NOTES_DELETE,
			},
		})
	}

	return {
		handleUpdateNotes,
		handleAddNote,
		handleDeleteNote,
		isPending: updateNotesMutation.isPending,
		isSuccess: updateNotesMutation.isSuccess,
	}
}
export default useNotes
