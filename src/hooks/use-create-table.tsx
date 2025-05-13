import React, { useState } from 'react'
import { statuses, titleToStatus } from '@/constants/episodes-constants'
import useEpisodeTable from '@/hooks/use-episode-table'
import useParentLanguage from '@/hooks/use-parent-language'
import WriterCombobox from '@/page-builders/episodes/table/writer-combobox'
import { HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import {
	ColumnDef,
	ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	Row,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import {
	ChevronDown,
	ChevronRight,
	EllipsisVertical,
	Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HoverCard } from '@/components/ui/hover-card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import useProjectId from '@/providers/project-id-provider'
import { formatDate } from '@/lib/format-date'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { EEpisodeHeaderKeys, TEpisode } from '@/types/episode-type'

export const useCreateTable = (episodes: TEpisode[]) => {
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [checked, setChecked] = useState<boolean>(false)
	const [lastSelectedRowIndex, setLastSelectedRowIndex] = useState<
		number | null
	>(null)

	const { handleTitleClick, handleStatusChange, handleDeleteEpisode } =
		useEpisodeTable()

	const { isWriter } = useProjectId()
	const language = useParentLanguage()

	const handleRowSelection = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		row: Row<TEpisode>
	) => {
		const isShiftPressed = e.shiftKey
		const rowIndex = row.index

		if (isShiftPressed && lastSelectedRowIndex !== null) {
			const start = Math.min(lastSelectedRowIndex, rowIndex)
			const end = Math.max(lastSelectedRowIndex, rowIndex)

			const newSelection = { ...rowSelection }
			for (let i = start; i <= end; i++) {
				const rowId = table.getRowModel().rows[i]?.id
				if (rowId) {
					newSelection[rowId] = true
				}
			}
			setRowSelection(newSelection)
		} else {
			const rowId = row.id
			const newSelection = { ...rowSelection }
			if (row.getIsSelected()) {
				delete newSelection[rowId]
			} else {
				newSelection[rowId] = true
			}
			setRowSelection(newSelection)
			setLastSelectedRowIndex(rowIndex)
		}
	}

	const writerOnlyColumns: ColumnDef<TEpisode>[] = [
		{
			accessorKey: EEpisodeHeaderKeys.ACTIONS,
			header: 'Actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="icon" variant="ghost">
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="min-w-0">
						<DropdownMenuItem
							disabled={!isWriter || !row.original.props?.creation_timestamp}
							onClick={() => handleDeleteEpisode(row.original.id)}
						>
							Delete <Trash2 size={16} className="ml-2" />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	]

	const languageDependentColumns: ColumnDef<TEpisode>[] = [
		{
			accessorKey: EEpisodeHeaderKeys.STATUS,
			header: 'Status',
			cell: ({ row, table }) => {
				const isSelected = !!rowSelection[row.id]
				const latestStatus: EStatus =
					row.getValue('status') === BASE_STATUS
						? EStatus.FIRST_DRAFT
						: row.getValue('status')
				const latestIndex = statuses.indexOf(latestStatus)

				if (
					row.original.language &&
					row.original.language !== ELanguage.GERMAN_ORIGINAL
				) {
					return null
				}
				if (row.depth) {
					return latestStatus
				}
				return (
					<Select
						value={latestStatus}
						onValueChange={(value) =>
							handleStatusChange(row.original, value as EStatus, table)
						}
						disabled={!isSelected && Object.keys(rowSelection).length > 0}
					>
						<SelectTrigger disabled={!isWriter} className="w-36">
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
			accessorKey: EEpisodeHeaderKeys.WRITER,
			header: 'Writer',
			cell: ({ row }) =>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				!row.depth ? (
					<WriterCombobox
						chapterId={String(row.original.id)}
						selectedMemberId={String(row.original.writer || '')}
					/>
				) : (
					row.getValue('writer') || 'Anonymous'
				),
		},
	]

	const columns: ColumnDef<TEpisode>[] = [
		{
			id: EEpisodeHeaderKeys.SELECT_COL,
			header: ({ table, column }) => {
				const isSomeSelected = table.getIsSomeRowsSelected()
				const isAllSelected = table.getIsAllRowsSelected()

				return (
					<Checkbox
						disabled={!isWriter}
						id={`header-${column.id}`}
						checked={isSomeSelected || isAllSelected}
						indeterminate={isSomeSelected}
						onClick={() => {
							if (isSomeSelected) {
								table.resetRowSelection()
							} else {
								table.toggleAllRowsSelected()
							}
						}}
					/>
				)
			},
			cell: ({ row }) =>
				!row.depth && (
					<Checkbox
						id={`row-${row.id}`}
						checked={row.getIsSelected()}
						disabled={!isWriter || !row.getCanSelect()}
						onClick={(e) => handleRowSelection(e, row)}
					/>
				),
		},
		{
			accessorKey: EEpisodeHeaderKeys.SERIAL_NUMBER,
			header: () => (
				<HoverCard openDelay={0}>
					<HoverCardTrigger> {`DE${checked ? '/US' : ''}`} </HoverCardTrigger>
					<HoverCardContent className="w-38 b</HoverCard>order z-[100] mt-2 rounded-md bg-background p-2">
						<div className="flex items-center justify-center gap-2">
							<p>US Index:</p>
							<Switch checked={checked} onCheckedChange={setChecked} />
						</div>
					</HoverCardContent>
				</HoverCard>
			),
			cell: ({ row }) =>
				!row.depth &&
				`${row.original.seq_number}${checked && row.original.original_seq_number ? `/${row.original.original_seq_number}` : ''}`,
		},
		{
			accessorKey: EEpisodeHeaderKeys.CHAPTER_TITLE,
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
							tooltip={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
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
					{row.getValue('chapter_title')}
				</div>
			),
		},
		{
			accessorKey: EEpisodeHeaderKeys.WORD_COUNT,
			header: 'Word Count',
			cell: ({ row }) => (
				<div
					className="flex cursor-pointer items-center gap-2 font-medium"
					onClick={() =>
						handleTitleClick(row.original.parent || row.original.id)
					}
				>
					{row.original.word_count}
				</div>
			),
		},
		...(language === ELanguage.GERMAN_ORIGINAL ? languageDependentColumns : []),
		{
			accessorKey: EEpisodeHeaderKeys.UPDATE_TIME,
			header: 'Last Updated',
			cell: ({ row }) => formatDate(row.original.update_time),
		},
		...(isWriter ? writerOnlyColumns : []),
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
	return { table, columnSize: columns.length, isWriter }
}
