import React, { useState } from 'react'
import { statuses, titleToStatusText } from '@/constants/episodes-constants'
import useEpisodeTable from '@/hooks/use-episode-table'
import useParentLanguage from '@/hooks/use-parent-language'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import { VerticalMenuIcon } from '@/icons/vertical-menu-icon'
import { TitleCell } from '@/page-builders/episodes/table/title-cell'
import WriterCombobox from '@/page-builders/episodes/table/writer-combobox'
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

import { Checkbox } from '@/components/aural-ui/checkbox'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/aural-ui/hover-card'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectSeparator,
	SelectTrigger,
	SelectWrapper,
} from '@/components/aural-ui/select'
import { Switch } from '@/components/aural-ui/switch'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/aural-ui/utils'
import { formatDate } from '@/lib/format-date'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { EEpisodeHeaderKeys, TEpisode } from '@/types/episode-type'

import useRenameTitleMutation from './mutation/use-rename-title'
import useAccessChecks from './use-access-checks'

const statusTagProps = {
	[EStatus.PUBLISHED]: { variant: 'system', color: 'positive' },
	[EStatus.FIRST_DRAFT]: { variant: 'system', color: 'negative' },
	[EStatus.SECOND_DRAFT]: { variant: 'system', color: 'warning' },
	[EStatus.POLISH]: { variant: 'promotional', color: 'hotpink' },
}

export const useCreateTable = (episodes: TEpisode[]) => {
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [editingRowId, setEditingRowId] = useState<number | null>(null)
	const [sorting, setSorting] = useState<SortingState>([])
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [checked, setChecked] = useState<boolean>(false)
	const [lastSelectedRowIndex, setLastSelectedRowIndex] = useState<
		number | null
	>(null)

	const inputValueMapRef = React.useRef<Record<number, string>>({})

	const { handleStatusChange, handleDeleteEpisode, statusUpdating } =
		useEpisodeTable()

	const { mutate: renameTitle, isPending } = useRenameTitleMutation()

	const { isWriter } = useProjectId()
	const { parentLanguage } = useParentLanguage()
	const { isGerman, isOriginal } = useAccessChecks()

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
			cell: ({ row }) =>
				!row.depth && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<IconButton
								variant="ghost"
								icon={<VerticalMenuIcon />}
								label="episode menu icon"
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-34">
							<DropdownMenuItem
								disabled={editingRowId === row.original.id}
								onClick={() => setEditingRowId(row.original.id)}
							>
								Rename
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={!isWriter || !row.original.props?.creation_timestamp}
								onClick={() =>
									handleDeleteEpisode(row.original.id, row.original?.seq_number)
								}
							>
								Delete
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
				// @ts-expect-error type any
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const tagProps = statusTagProps[latestStatus]

				if (!(isGerman || isOriginal)) {
					return null
				}
				if (row.depth) {
					return (
						<Tag {...tagProps} emphasis="secondary" className="ml-4">
							{titleToStatusText[latestStatus]}
						</Tag>
					)
				}

				if (!isWriter) {
					return (
						<Tag {...tagProps} emphasis="secondary">
							{titleToStatusText[latestStatus]}
						</Tag>
					)
				}

				const isUpdating = statusUpdating.includes(row.original.id)

				return (
					<SelectRoot>
						<SelectWrapper>
							<Select
								onValueChange={(value) =>
									handleStatusChange(row.original, value as EStatus, table)
								}
								disabled={
									(!isSelected && Object.keys(rowSelection).length > 0) ||
									isUpdating
								}
							>
								<SelectTrigger
									decoration="outline"
									disabled={!isWriter}
									classes={{
										root: 'h-10 text-sm',
										icon: cn(
											'text-fm-icon-inactive group-data-[state=open]:text-fm-primary',
											{
												hidden: isUpdating,
											}
										),
									}}
								>
									<Tag {...tagProps} emphasis="secondary">
										{titleToStatusText[latestStatus]}
									</Tag>
									<If condition={isUpdating}>
										<CircularLoader className="size-3" />
									</If>
								</SelectTrigger>
								<SelectContent>
									{statuses.map((status, index) => (
										<div key={status}>
											<SelectItem
												disabled={index != latestIndex + 1}
												value={status}
												className="h-10 !text-sm"
											>
												{titleToStatusText[status]}
											</SelectItem>
											<If condition={index < statuses.length - 1}>
												<SelectSeparator />
											</If>
										</div>
									))}
								</SelectContent>
							</Select>
						</SelectWrapper>
					</SelectRoot>
				)
			},
		},
		{
			accessorKey: EEpisodeHeaderKeys.WRITER,
			header: 'Writer',
			cell: ({ row }) =>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				!row.depth && (
					<WriterCombobox
						chapterId={String(row.original.id)}
						selectedMemberId={String(row.original.writer || '')}
					/>
				),
		},
	]

	const writerOnlySelectColumns: ColumnDef<TEpisode>[] = [
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
						className="border-fm-divider-primary bg-fm-surface-primary size-6 border-1"
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
						className="border-fm-divider-primary bg-fm-surface-primary size-6 border-1"
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						onClick={(e) => handleRowSelection(e, row)}
					/>
				),
		},
	]

	const columns: ColumnDef<TEpisode>[] = [
		...(isWriter ? writerOnlySelectColumns : []),
		{
			accessorKey: EEpisodeHeaderKeys.SERIAL_NUMBER,
			header: () => (
				<HoverCard openDelay={0}>
					<HoverCardTrigger> {`DE${checked ? '/US' : ''}`} </HoverCardTrigger>
					<HoverCardContent className="z-100 mt-5 w-38 p-2" align="start">
						<div className="flex items-center justify-center gap-2">
							<Typography
								variant="caption-medium"
								color="secondary"
								transform="uppercase"
								lineHeight="normal"
							>
								US Index:
							</Typography>
							<Switch checked={checked} onCheckedChange={setChecked} />
						</div>
					</HoverCardContent>
				</HoverCard>
			),
			cell: ({ row }) =>
				!row.depth && (
					<div className="flex items-center justify-start">
						<div>
							{row.original.seq_number}
							{checked && row.original.original_seq_number
								? `/${row.original.original_seq_number}`
								: ''}
						</div>
						<div>
							{row.getCanExpand() && (
								<IconButton
									variant="ghost"
									label="Toggle row expansion"
									className="text-fm-icon-inactive hover:text-fm-primary"
									onClick={(e) => {
										e.stopPropagation()
										row.getToggleExpandedHandler()()
									}}
									tooltip={row.getIsExpanded() ? 'Collapse' : 'Expand'}
									icon={
										row.getIsExpanded() ? (
											<ChevronUpIcon />
										) : (
											<ChevronDownIcon />
										)
									}
								/>
							)}
						</div>
					</div>
				),
		},
		{
			accessorKey: EEpisodeHeaderKeys.CHAPTER_TITLE,
			header: 'Title',
			cell: ({ row }) => (
				<TitleCell
					row={row}
					editingRowId={editingRowId}
					setEditingRowId={setEditingRowId}
					inputValueMapRef={inputValueMapRef}
					isPending={isPending}
					renameTitle={renameTitle}
				/>
			),
		},
		{
			accessorKey: EEpisodeHeaderKeys.WORD_COUNT,
			header: 'Word Count',
			cell: ({ row }) => (
				<div className="font-fm-text flex cursor-pointer items-center gap-2 text-sm">
					{row.original.word_count}
				</div>
			),
		},
		...(parentLanguage === ELanguage.GERMAN_ORIGINAL
			? languageDependentColumns
			: []),
		{
			accessorKey: EEpisodeHeaderKeys.UPDATE_TIME,
			header: 'Last Updated',
			cell: ({ row }) => (
				<div className="font-fm-text flex cursor-pointer items-center gap-2 text-sm">
					{formatDate(row.original.update_time)}
				</div>
			),
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

	return { table, columnSize: columns.length, isWriter, editingRowId }
}
