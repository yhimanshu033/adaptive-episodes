import React from 'react'
import usePlateStore from '@/store/plate-store'
import { ArrowLeft } from 'lucide-react'

import { StoryAccordion } from '@/components/render-content'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format-date'

import { TNote } from '@/types/plate-types'

const NoteContent = ({
	activeNoteId,
	notes,
}: {
	activeNoteId: string
	notes: TNote[]
}) => {
	const { setActiveNoteId } = usePlateStore()
	const note = notes.find((note) => note.id === activeNoteId)
	return (
		<div className="">
			<div className="flex">
				<div className="flex-1">
					<div className="mb-2 text-2xl font-bold">
						{note?.title || 'Title'}
					</div>
					<div className="mb-4 text-sm text-muted-foreground">
						Last updated: {formatDate(note?.updateTime || '')}
					</div>
				</div>
				<Button
					size="icon"
					onClick={() => setActiveNoteId(null)}
					className="mb-4 flex items-center space-x-2"
				>
					<ArrowLeft size={16} />
				</Button>
			</div>
			<StoryAccordion explorerData={note?.content || ''} />
		</div>
	)
}

export default NoteContent
