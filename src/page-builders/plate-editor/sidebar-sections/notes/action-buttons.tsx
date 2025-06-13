import React, { useMemo } from 'react'
import useNotes from '@/hooks/use-notes'
import { EditBigIcon } from '@/icons/edit-big-icon'
import { TrashIcon } from '@/icons/trash-icon'
import useEditorNoteStore from '@/store/edit-note-store'
import useEpisodeIdStore from '@/store/episode-id-store'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { If } from '@/components/aural-ui/if-else'

export function ActionButtons({
	id,
	edit,
}: {
	edit: string | undefined
	id: string
}) {
	const { setFormOpen, setMode } = useEditorNoteStore()
	const { handleDeleteNote, isPending } = useNotes()
	const { setActiveNoteId } = useEpisodeIdStore()

	const handleEdit = () => {
		setActiveNoteId(id)
		setFormOpen(true)
		setMode('save')
	}

	const handelDelete = () => {
		handleDeleteNote(id)
	}

	const { icon: deleteIcon, text: deleteText } = useMemo(() => {
		if (isPending) {
			return {
				icon: <CircularLoader />,
				text: 'Deleting...',
			}
		}
		return {
			icon: <TrashIcon className="text-fm-negative size-4 stroke-2" />,
			text: 'Delete',
		}
	}, [isPending])
	return (
		<div className="flex max-h-0 w-full justify-end gap-4 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-20 group-hover:opacity-100">
			<If condition={typeof edit === 'string'}>
				<Button
					variant="text"
					onClick={handleEdit}
					leftIcon={<EditBigIcon className="size-4 stroke-2" />}
					size="sm"
					innerClassName="!p-0"
				>
					Edit
				</Button>
			</If>
			<Button
				variant="text"
				onClick={handelDelete}
				leftIcon={deleteIcon}
				size="sm"
				innerClassName="!p-0"
				className="text-fm-negative"
			>
				{deleteText}
			</Button>
		</div>
	)
}
