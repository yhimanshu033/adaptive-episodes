import React from 'react'

import Badge from '@/components/aural-ui/badge'
import { Divider } from '@/components/aural-ui/divider'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { formatDate } from '@/lib/format-date'
import { formatExplorerData } from '@/lib/utils/explorer'

import { TNote } from '@/types/plate-types'

import { ActionButtons } from './action-buttons'

const NoteCard = ({ note }: { note: TNote }) => {
	const {
		id,
		title,
		content,
		updateTime,
		episodeNo,
		episodeRange,
		modeAction,
		edit,
	} = note
	return (
		<div className="group flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<Typography as="h2" variant="body-small" align="left">
					{title}
				</Typography>
				<div
					className="text-fm-md text-fm-tertiary line-clamp-3 gap-4 overflow-hidden transition-all duration-1000 ease-out hover:line-clamp-none hover:max-h-full"
					dangerouslySetInnerHTML={{
						__html: formatExplorerData(content ?? '').replace(/\n/g, '<br/>'),
					}}
				/>
			</div>
			<div className="flex gap-1">
				<Badge size="xs">Updated : {formatDate(updateTime)}</Badge>
				<If condition={!!episodeRange}>
					<Badge size="xs">EP - {episodeRange}</Badge>
				</If>
				<If condition={!!episodeNo}>
					<Badge size="xs">EP - {episodeNo}</Badge>
				</If>
				<If condition={!!modeAction}>
					<Badge size="xs">{modeAction}</Badge>
				</If>
			</div>
			<ActionButtons id={id} edit={edit} />
			<Divider variant="secondary" />
		</div>
	)
}

export default NoteCard
