/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect } from 'react'
import { useNotesData } from '@/hooks/query/use-notes-query'
import { NotesIcon } from '@/icons/notes-icon'
import AddNotes from '@/page-builders/plate-editor/sidebar-sections/notes/add-notes'
import NoteCard from '@/page-builders/plate-editor/sidebar-sections/notes/note-card'
import useEditorNoteStore from '@/store/edit-note-store'
import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import DotLoader from '@/components/aural-ui/dot-loader'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'

import { TNote } from '@/types/plate-types'

import EditNote from './edit-note'

const Notes = () => {
	const { isFormOpen, setFormOpen } = useEditorNoteStore()
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
	}, [data])

	useEffect(() => {
		return () => {
			setFormOpen(false)
		}
	}, [])

	const RenderNotes = () => {
		if (isLoading) {
			return (
				<div className="flex h-full flex-col justify-center">
					<DotLoader />
				</div>
			)
		}

		return (
			<div className="relative flex h-svh flex-col gap-4">
				<AddNotes />
				<If condition={!notes?.length}>
					<div className="flex h-full flex-col items-center justify-center gap-6">
						<div className="bg-fm-surface-frosted/20 flex size-12 items-center justify-center rounded-full p-4">
							<NotesIcon className="text-fm-icon-inactive stroke-1.5 size-6" />
						</div>
						<Typography color="tertiary" className="px-5" align="center">
							It&apos;s quiet here. Start adding your notes, and you&apos;ll see
							them here
						</Typography>
					</div>
				</If>
				{notes.map((note) => {
					return <NoteCard key={note.id} note={note} />
				})}
				<If condition={isFormOpen}>
					<EditNote />
				</If>
			</div>
		)
	}

	return (
		<section className="h-svh px-6 pt-8">
			<RenderNotes />
		</section>
	)
}

export default Notes
