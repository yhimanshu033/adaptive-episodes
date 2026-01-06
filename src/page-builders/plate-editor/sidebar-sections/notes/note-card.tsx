import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import Badge from '@/components/aural-ui/badge'
import { Divider } from '@/components/aural-ui/divider'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'
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

	const contentRef = useRef<HTMLDivElement>(null)
	const [expanded, setExpanded] = useState(false)
	const [maxHeight, setMaxHeight] = useState('0px')
	const [isExpandable, setIsExpandable] = useState(false)

	const handleExpand = useCallback(() => {
		setExpanded((prev) => !prev)
	}, [])

	useLayoutEffect(() => {
		if (contentRef.current) {
			const scrollHeight = contentRef.current.scrollHeight
			const collapsedHeight = 56

			setMaxHeight(expanded ? `${scrollHeight}px` : `${collapsedHeight}px`)
			setIsExpandable(scrollHeight > collapsedHeight)
		}
	}, [expanded, content])

	return (
		<div className="group flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<Typography as="h2" variant="body-small" align="left">
					{title}
				</Typography>
				<div
					className="overflow-hidden transition-all duration-500 ease-in-out"
					style={{ maxHeight }}
				>
					<div
						ref={contentRef}
						className={cn('!text-fm-md text-fm-tertiary', {
							'line-clamp-2': !expanded,
						})}
						dangerouslySetInnerHTML={{
							__html: formatExplorerData(content ?? '').replace(/\n/g, '<br/>'),
						}}
					/>
				</div>
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
			<ActionButtons
				id={id}
				edit={edit}
				handleExpand={handleExpand}
				expanded={expanded}
				isExpandable={isExpandable}
			/>
			<Divider variant="secondary" />
		</div>
	)
}

export default NoteCard
