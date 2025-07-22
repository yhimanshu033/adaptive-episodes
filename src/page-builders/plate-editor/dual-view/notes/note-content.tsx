import React, { useRef } from 'react'
import useNotes from '@/hooks/use-notes'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Value } from '@udecode/plate'
import { ArrowLeft, Save } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { StoryAccordion } from '@/components/render-content'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { formatDate } from '@/lib/format-date'

import { TNote } from '@/types/plate-types'

import EditNote from './edit-note'

const NoteContent = ({
	activeNoteId,
	notes,
}: {
	activeNoteId: string
	notes: TNote[]
}) => {
	const { setActiveNoteId } = useEpisodeIdStore()
	const note = notes.find((note) => note.id === activeNoteId)
	const { handleUpdateNotes, isPending } = useNotes()

	const editorRef = useRef<Value | null>(null)

	const onClickSave = () => {
		if (!editorRef.current) {
			return
		}
		handleUpdateNotes(activeNoteId, { edit: JSON.stringify(editorRef.current) })
		editorRef.current = null
	}

	if (!note) {
		return null
	}

	return (
		<div>
			<div className="bg-background sticky top-10 z-10 flex justify-between pt-3">
				<div>
					<EditableText
						key={activeNoteId}
						text={note?.title || 'Untitled'}
						inputClass="text-2xl font-bold"
						rootClass="mb-2 text-2xl font-bold"
						btnClass="size-5"
						isEditable={true}
						onComplete={(text: string) =>
							handleUpdateNotes(activeNoteId, { title: text })
						}
					/>
					<p className="text-muted-foreground mb-4 text-sm">
						Last updated: {formatDate(note?.updateTime || '')}
					</p>
				</div>
				<div className="flex gap-2">
					{'edit' in note && (
						<Button
							size="icon"
							disabled={isPending}
							tooltip={isPending ? null : 'Save'}
						>
							{isPending ? (
								<Spinner size={16} />
							) : (
								<Save size={16} onClick={onClickSave} />
							)}
						</Button>
					)}
					<Button
						tooltip="Back"
						size="icon"
						onClick={() => setActiveNoteId(null)}
						className="mb-4 flex items-center space-x-2"
					>
						<ArrowLeft size={16} />
					</Button>
				</div>
			</div>
			<StoryAccordion explorerData={note?.content || ''} />
			{'edit' in note && (
				<EditNote editorRef={editorRef} content={note.edit || ''} />
			)}
		</div>
	)
}

export default NoteContent
