import React, { useMemo } from 'react'
import useNotes from '@/hooks/use-notes'
import { EditBigIcon } from '@/icons/edit-big-icon'
import { EyeCloseIcon } from '@/icons/eye-close-icon'
import { EyeOpenIcon } from '@/icons/eye-open-icon'
import { TrashIcon } from '@/icons/trash-icon'
import useEditorNoteStore from '@/store/edit-note-store'
import useEpisodeIdStore from '@/store/episode-id-store'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { If } from '@/components/aural-ui/if-else'
import DeleteModal from '@/components/delete-modal'

export function ActionButtons({
	id,
	edit,
	handleExpand,
	expanded,
	isExpandable,
}: {
	edit: string | undefined
	expanded: boolean
	handleExpand: () => void
	id: string
	isExpandable: boolean
}) {
	const { setFormOpen, setMode } = useEditorNoteStore()
	const { handleDeleteNote, isPending } = useNotes()
	const { setActiveNoteId } = useEpisodeIdStore()

	const handleEdit = () => {
		setActiveNoteId(id)
		setFormOpen(true)
		setMode('Save')
	}

	const handelDelete = () => {
		handleDeleteNote(id)
	}

	const deleteModalContent = {
		title: 'Are you sure you want to delete this?',
		subTitle: "Once deleted, this can't be undone.",
	}

	const { icon: deleteIcon, text: deleteText } = useMemo(() => {
		if (isPending) {
			return {
				icon: <CircularLoader />,
				text: 'Deleting...',
			}
		}
		return {
			icon: <TrashIcon className="size-4 stroke-2 text-inherit" />,
			text: 'Delete',
		}
	}, [isPending])

	return (
		<div className="flex max-h-0 w-full items-center justify-end gap-4 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-20 group-hover:opacity-100">
			<If condition={isExpandable}>
				<Button
					variant="text"
					onClick={handleExpand}
					className="opacity-80 hover:opacity-100"
					leftIcon={
						expanded ? (
							<EyeCloseIcon className="size-4 stroke-2" />
						) : (
							<EyeOpenIcon className="size-4 stroke-2" />
						)
					}
					size="sm"
					innerClassName="!p-0"
				>
					{expanded ? 'Collapse' : 'Expand'}
				</Button>
			</If>
			<If condition={typeof edit === 'string'}>
				<Button
					variant="text"
					onClick={handleEdit}
					leftIcon={<EditBigIcon className="size-4 stroke-2" />}
					className="opacity-80 hover:opacity-100"
					size="sm"
					innerClassName="!p-0"
				>
					Edit
				</Button>
			</If>
			<DeleteModal
				onPrimaryClick={handelDelete}
				title={deleteModalContent.title}
				subTitle={deleteModalContent.subTitle}
			>
				<Button
					variant="text"
					leftIcon={deleteIcon}
					size="sm"
					innerClassName="!p-0"
					className="text-fm-negative/80 hover:text-fm-negative"
				>
					{deleteText}
				</Button>
			</DeleteModal>
		</div>
	)
}
