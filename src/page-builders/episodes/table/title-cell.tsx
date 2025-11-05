import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { EPISODE_SEQUENCE } from '@/constants/global-constants'
import { UseMutateFunction } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/aural-ui/button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { InputBase } from '@/components/aural-ui/input'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { cn } from '@/lib/aural-ui/utils'
import { FetchResponseResult } from '@/lib/fetch-api'

import { TEpisode, TPatchEpisodeBody } from '@/types/episode-type'

interface TitleCellProps {
	editingRowId: number | null
	inputValueMapRef: React.MutableRefObject<Record<number, string>>
	isPending: boolean
	renameTitle: UseMutateFunction<
		FetchResponseResult<TPatchEpisodeBody>,
		Error,
		{
			episodeId: number
			newTitle: string
		},
		unknown
	>

	row: Row<TEpisode>
	setEditingRowId: (rowId: number | null) => void
}

export const TitleCell: React.FC<TitleCellProps> = ({
	row,
	editingRowId,
	setEditingRowId,
	inputValueMapRef,
	renameTitle,
	isPending = false,
}) => {
	const editInputRef = useRef<HTMLInputElement>(null)
	const originalValue = row.original?.chapter_title || 'Untitled'
	const [inputValue, setInputValue] = useState<string>(originalValue)

	const handleRenameSubmit = (episodeId: number, newTitle: string) => {
		inputValueMapRef.current[episodeId] = newTitle
		renameTitle(
			{
				episodeId,
				newTitle,
			},
			{
				onSuccess: () => {
					delete inputValueMapRef.current[episodeId]
				},
			}
		)
		setEditingRowId(null)
	}

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			const target = e.target as HTMLInputElement
			if (editingRowId) {
				handleRenameSubmit(editingRowId, target.value)
			}
		} else if (e.key === 'Escape') {
			e.preventDefault()
			setEditingRowId(null)
		}
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const relatedTarget = e.relatedTarget as HTMLElement
		if (!relatedTarget || !relatedTarget.closest('[data-submit-button]')) {
			setEditingRowId(null)
		}
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		handleRenameSubmit(row.original.id, editInputRef.current?.value || '')
	}

	useEffect(() => {
		if (editingRowId === row.original.id && editInputRef.current) {
			editInputRef.current.focus()
			editInputRef.current.select()
		}
	}, [editingRowId, row.original.id])

	return (
		<div>
			<IfElse condition={editingRowId === row.original.id && !isPending}>
				<If>
					<div
						className="border-fm-divider-primary flex w-full items-center justify-between gap-2 border-1 pl-2"
						style={{ pointerEvents: 'all' }}
					>
						<InputBase
							ref={editInputRef}
							type="text"
							className="min-w-0 text-sm focus:border-none focus:ring-0 focus:outline-none"
							unstyled
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onBlur={handleBlur}
							onKeyDown={handleInputKeyDown}
						/>
						<Button
							type="submit"
							variant="text"
							size="sm"
							data-submit-button="true"
							className={cn(
								'text-fm-tertiary translate-y-1 cursor-pointer text-xs',
								{
									'text-fm-primary': originalValue !== inputValue,
								}
							)}
							onMouseDown={handleSubmit}
						>
							Submit
						</Button>
					</div>
				</If>
				<Else>
					<ScrollArea
						orientation="horizontal"
						classes={{ scrollbar: 'hidden' }}
					>
						<Link
							prefetch={false}
							className="font-fm-text flex cursor-pointer items-center gap-2"
							href={`/projects/${row.original.project}/${row.original.parent || row.original.id}/content/?${EPISODE_SEQUENCE}=${row.original.seq_number}`}
						>
							{isPending && inputValueMapRef.current[row.original.id]
								? inputValueMapRef.current[row.original.id]
								: originalValue}
						</Link>
					</ScrollArea>
				</Else>
			</IfElse>
		</div>
	)
}
