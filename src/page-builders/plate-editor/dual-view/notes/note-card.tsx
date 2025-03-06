import React from 'react'
import useSaveEpisode from '@/hooks/use-save-episode'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

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
	const { setActiveNoteId } = usePlateStore()
	const { isPending } = useSaveEpisode()
	const { deleteNote } = useEpisodeIdStore()
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
					<CardDescription className="line-clamp-2 text-sm text-foreground">
						{typeof content === 'string'
							? content
							: `${content.length} results`}
					</CardDescription>
					<div className="mt-2 text-xs text-muted-foreground">
						Last updated: {formatDate(updateTime)}
					</div>
				</CardContent>
			</Card>
			<div className="absolute right-2 top-2 hidden items-center justify-center rounded text-center group-hover:flex">
				{isPending ? (
					<IconLoader />
				) : (
					<Button
						variant="outline"
						size="icon"
						onClick={(e) => {
							e.stopPropagation()
							toast.success('Notiz erfolgreich gelöscht!')
							deleteNote(id)
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
