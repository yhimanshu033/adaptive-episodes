import React, { useState } from 'react'
import { statuses, titleToStatus } from '@/constants/episodes-constants'
import useEpisodeTable from '@/hooks/use-episode-table'
import WriterCombobox from '@/page-builders/episodes/writer-combobox'
// import { updateEpisode } from '@/server-action/content-action'
import {
	ColumnDef,
	ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/format-date'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

import useUserMembersQuery from './query/user-members-data'

export const useCreateTable = (episodes: TEpisode[]) => {
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const { data: members } = useUserMembersQuery()

	const { handleTitleClick, handleStatusChange, handleDeleteEpisode } =
		useEpisodeTable()
	const columns: ColumnDef<TEpisode>[] = [
		{
			id: 'select-col',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllRowsSelected()}
					onClick={table.getToggleAllRowsSelectedHandler()}
				/>
			),
			cell: ({ row }) =>
				!row.depth && (
					<Checkbox
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onClick={row.getToggleSelectedHandler()}
					/>
				),
		},
		{
			accessorKey: 'serialNumber',
			header: '#',
			cell: ({ row }) => !row.depth && row.original.seq_number,
		},
		{
			accessorKey: 'chapter_title',
			header: 'Title',
			cell: ({ row }) => (
				<div
					className="flex cursor-pointer items-center gap-2 font-medium"
					onClick={() =>
						handleTitleClick(row.original.parent || row.original.id)
					}
				>
					{row.getCanExpand() && (
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.stopPropagation()
								row.getToggleExpandedHandler()()
							}}
						>
							{row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
						</Button>
					)}
					{row.getValue('chapter_title')} ({row.original.word_count} words)
				</div>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row, table }) => {
				const isSelected = !!rowSelection[row.id]
				const latestStatus: EStatus =
					row.getValue('status') === BASE_STATUS
						? EStatus.FIRST_DRAFT
						: row.getValue('status')
				const latestIndex = statuses.indexOf(latestStatus)
				if (row.depth) return latestStatus
				return (
					<Select
						value={latestStatus}
						onValueChange={(value) =>
							handleStatusChange(row.original, value as EStatus, table)
						}
						disabled={!isSelected && Object.keys(rowSelection).length > 0}
					>
						<SelectTrigger className="w-36">
							<SelectValue>{titleToStatus[latestStatus]}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{statuses.map((status, index) => (
								<SelectItem
									disabled={index < latestIndex || index > latestIndex + 1}
									key={status}
									value={status}
								>
									{titleToStatus[status]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)
			},
		},
		{
			accessorKey: 'writer',
			header: 'Writer',
			cell: ({ row }) =>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				!row.depth ? (
					<WriterCombobox
						members={members?.members}
						chapterId={String(row.original.id)}
						selectedMemberId={row.original.writer}
					/>
				) : (
					row.getValue('writer') || 'Anonymous'
				),
		},
		{
			accessorKey: 'update_time',
			header: 'Last Updated',
			cell: ({ row }) => formatDate(row.original.update_time),
		},
		{
			accessorKey: 'delete',
			header: 'Delete',
			cell: ({ row }) =>
				row.original.props?.creation_timestamp && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleDeleteEpisode(row.original.id)}
					>
						<Trash2 size={16} />
					</Button>
				),
		},
	]

	const table = useReactTable({
		data: episodes,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		getExpandedRowModel: getExpandedRowModel(),
		getSubRows: (row) => row.props?.original_chapters,
		onExpandedChange: setExpanded,
		state: {
			sorting,
			rowSelection,
			expanded,
		},
	})
	return { table, columnSize: columns.length }
}
