import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { episodeLimit, statuses } from '@/constants/episodes-constants'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

import SkeletonBuilder from './episode-skeleton'
import Filters from './filters'
import EpisodesPagination from './pagination'

const EpisodesTable = () => {
	const [episodes, setEpisodes] = useState<TEpisode[]>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [episodeFilter, setEpisodeFilter] = useState<string>('')
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const router = useRouter()
	const pathname = usePathname()

	const { data } = useEpisodesData(episodeFilter, currentPage)

	const handleStatusChange = (episodeId: number, newStatus: EStatus) => {
		setEpisodes(
			episodes.map((episode) =>
				episode.id === episodeId ? { ...episode, status: newStatus } : episode
			)
		)
	}

	const handleWriterChange = (episodeId: number, newWriter: string) => {
		setEpisodes(
			episodes.map((episode) =>
				episode.id === episodeId ? { ...episode, writer: newWriter } : episode
			)
		)
	}

	const handleClick = (episodeId: number) => {
		router.push(`${pathname}/${episodeId}/editor`)
	}

	const columns: ColumnDef<TEpisode>[] = [
		{
			id: 'select-col',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllRowsSelected()}
					// indeterminate={table.getIsSomeRowsSelected()}
					onClick={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
				/>
			),
			cell: ({ row }) => (
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
			cell: ({ row }) => row.index + (currentPage - 1) * 10 + 1,
		},
		{
			accessorKey: 'chapter_title',
			header: 'Title',
			cell: ({ row }) => (
				<div
					className="cursor-pointer font-medium"
					onClick={() => handleClick(row.original.parent || row.original.id)}
				>
					{row.getValue('chapter_title')} ({row.original.word_count} words)
				</div>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<Select
					value={row.getValue('status')}
					onValueChange={(value) =>
						handleStatusChange(row.original.id, value as EStatus)
					}
				>
					<SelectTrigger className="w-32">
						<SelectValue>
							{row.getValue('status') === BASE_STATUS
								? EStatus.FIRST_DRAFT
								: row.getValue('status')}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{statuses.map((status) => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
		},
		{
			accessorKey: 'writer',
			header: 'Writer',
			cell: ({ row }) => (
				<EditableText
					key={row.original.id}
					text={row.getValue('writer') || 'Anonymous'}
					isEditable
					onComplete={handleWriterChange.bind(null, row.original.id)}
				/>
			),
		},
		{
			accessorKey: 'update_time',
			header: 'Last Updated',
			cell: ({ row }) => formatDate(row.original.update_time),
		},
	]

	const table = useReactTable({
		data: episodes,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		pageCount: data?.count || 0,
		state: {
			sorting,
			rowSelection,
		},
	})

	useEffect(() => {
		if (data) setEpisodes(data?.results.data)
	}, [data])

	return (
		<>
			<div className="flex gap-2">
				<Filters setEpisodeFilter={setEpisodeFilter} />
				{Object.keys(rowSelection).length ? (
					<Select>
						<SelectTrigger className="w-32">
							<SelectValue>Select Status</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{statuses.map((status) => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : null}
			</div>
			<ScrollArea className="overflow-auto-y relative flex max-h-[48vh] w-full flex-col rounded-md border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-background">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border"
										>
											{header.isPlaceholder ? null : (
												<div
													className={cn(
														header.column.getCanSort() &&
															'flex cursor-pointer select-none items-center'
													)}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: <ChevronUp className="ml-2 size-4" />,
														desc: <ChevronDown className="ml-2 size-4" />,
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn({ selected: row.getIsSelected() })}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={columns.length + 1}>
									<SkeletonBuilder count={5} className="h-8" />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollArea>
			<EpisodesPagination
				setPage={setCurrentPage}
				currentPage={currentPage}
				totalPages={data ? data.count / episodeLimit : 0}
			/>
		</>
	)
}

export default EpisodesTable
