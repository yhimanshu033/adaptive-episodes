import React, { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import { episodes_list, EpisodesType } from '@/mock-data/episodes'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import EditableText from '@/components/editable-text'
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
import { cn } from '@/lib/utils'

import Filters from './filters'

const EpisodesTable = () => {
	const [episodes, setEpisodes] = useState(episodes_list)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const router = useRouter()
	const pathname = usePathname()

	const uniqueWriters = useMemo(
		() => Array.from(new Set(episodes.map((e) => e.writer))),
		[episodes]
	)

	const handleStatusChange = (episodeId: number, newStatus: string) => {
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

	const columns: ColumnDef<EpisodesType>[] = [
		{
			accessorKey: 'serialNumber',
			header: '#',
			cell: ({ row }) => row.index + 1,
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ row }) => (
				<div
					className="cursor-pointer font-medium"
					onClick={() => handleClick(row.original.id)}
				>
					{row.getValue('title')} ({row.original.wordCount} words)
				</div>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<Select
					value={row.getValue('status')}
					onValueChange={(value) => handleStatusChange(row.original.id, value)}
				>
					<SelectTrigger className="w-32">
						<SelectValue>{row.getValue('status')}</SelectValue>
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
					text={row.getValue('writer')}
					isEditable
					onComplete={handleWriterChange.bind(null, row.original.id)}
				/>
			),
		},
		{
			accessorKey: 'lastUpdated',
			header: 'Last Updated',
		},
	]

	const table = useReactTable({
		data: episodes,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters,
		},
	})

	return (
		<>
			<Filters table={table} uniqueWriters={uniqueWriters} />
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
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
									data-state={row.getIsSelected() && 'selected'}
									className="transition-colors"
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
							<TableRow>
								<TableCell
									colSpan={columns.length + 1}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	)
}

export default EpisodesTable
