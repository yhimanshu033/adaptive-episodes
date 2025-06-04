import React from 'react'
import useNotes from '@/hooks/use-notes'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Trash2 } from 'lucide-react'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/format-date'

import { TNote } from '@/types/plate-types'

const NoteCard = ({ id, title, content, updateTime }: TNote) => {
	const { setActiveNoteId } = useEpisodeIdStore()
	const { handleDeleteNote, isPending } = useNotes()
	return (
		<div className="group relative">
			<Card
				className="h-full cursor-pointer transition-shadow hover:shadow-lg"
				onClick={() => setActiveNoteId(id)}
			>
				<CardHeader>
					<CardTitle className="break-words">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					{content && (
						<CardDescription className="text-foreground line-clamp-2 text-sm">
							{typeof content === 'string'
								? content
								: `${content.length} results from Explorer`}
						</CardDescription>
					)}
					<div className="text-muted-foreground mt-2 text-xs">
						Last updated: {formatDate(updateTime)}
					</div>
				</CardContent>
			</Card>
			<div className="absolute top-2 right-2 hidden items-center justify-center rounded text-center group-hover:flex">
				{isPending ? (
					<IconLoader />
				) : (
					<Button
						tooltip="Delete Note"
						variant="outline"
						size="icon"
						onClick={(e) => {
							e.stopPropagation()
							handleDeleteNote(id)
						}}
					>
						<Trash2 size={16} />
					</Button>
				)}
			</div>
		</div>
	)
}

export default NoteCard
