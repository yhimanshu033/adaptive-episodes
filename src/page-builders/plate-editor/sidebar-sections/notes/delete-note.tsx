'use client'

import React from 'react'
import useNotes from '@/hooks/use-notes'
import { TrashIcon } from '@/icons/trash-icon'
import useEditorNoteStore from '@/store/edit-note-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Typography } from '@/components/aural-ui/typography'

const DeleteNote = () => {
	const { isOpen, setShowDelete } = useEditorNoteStore(
		useShallow((state) => ({
			isOpen: state.showDelete,
			setShowDelete: state.setShowDelete,
		}))
	)
	const { store, setActiveNoteId } = useEpisodeIdStore()
	const id = store(useShallow((state) => state.activeNoteId))
	const { handleDeleteNote } = useNotes()

	const deleteModalContent = {
		title: 'Are you sure you want to delete this?',
		subTitle: "Once deleted, this can't be undone.",
	}

	const handelClose = () => {
		setShowDelete(false)
		setActiveNoteId(null)
	}

	const handleDelete = () => {
		if (id) {
			handleDeleteNote(id)
		}
		handelClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handelClose}>
			<DialogContent
				variant="negative"
				classes={{
					root: 'flex h-88 w-99 flex-col items-center px-6 py-8 text-center',
					overlay: 'z-60',
					content: 'z-70',
				}}
				noise="none"
			>
				<DialogTitle className="sr-only">Delete Modal</DialogTitle>
				<DialogDescription className="sr-only">
					{deleteModalContent.subTitle}
				</DialogDescription>
				<div className="flex flex-col items-center gap-8">
					<TrashIcon height={44} width={44} className="text-fm-negative" />
					<div className="space-y-2">
						<Typography align="center" as="h2" variant="body-large">
							{deleteModalContent.title}
						</Typography>
						<Typography align="center" color="tertiary">
							{deleteModalContent.subTitle}
						</Typography>
					</div>
					<div className="flex w-full flex-col gap-5">
						<Button variant="secondary" onClick={handleDelete}>
							Delete
						</Button>
						<Button variant="outline" onClick={handelClose}>
							Cancel
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteNote
