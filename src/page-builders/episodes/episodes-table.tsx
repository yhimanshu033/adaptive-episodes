import React, { useEffect, useMemo, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeData from '@/hooks/query/use-episode-data'
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
import { Button } from '@/components/ui/button'
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

import { EpisodeResponse, EpisodeType } from '@/types/episode-type'

import Filters from './filters'

const EpisodesTable = () => {
	const [episodes, setEpisodes] = useState<EpisodeType[]>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const router = useRouter()
	const pathname = usePathname()
	const { id } = useParams()

	const {
		data: episodePages,
		isLoading,
		hasNextPage,
		fetchNextPage,
	} = useEpisodeData(id as string)

	const uniqueWriters = useMemo(
		() => Array.from(new Set(episodes.map((e) => e.author))),
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

	const handleRefetch = () => {
		void fetchNextPage()
	}

	const columns: ColumnDef<EpisodeType>[] = [
		{
			accessorKey: 'serialNumber',
			header: '#',
			cell: ({ row }) => row.index + 1,
		},
		{
			accessorKey: 'episode_name',
			header: 'Title',
			cell: ({ row }) => (
				<div
					className="cursor-pointer font-medium"
					onClick={() => handleClick(row.original.id)}
				>
					{row.getValue('episode_name')} ({row.original.wordcount} words)
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
			accessorKey: 'author',
			header: 'Writer',
			cell: ({ row }) => (
				<EditableText
					key={row.original.id}
					text={row.getValue('author')}
					isEditable
					onComplete={handleWriterChange.bind(null, row.original.id)}
				/>
			),
		},
		{
			accessorKey: 'last_updated',
			header: 'Last Updated',
			cell: ({ row }) => formatDate(row.original.last_updated),
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

	useEffect(() => {
		if (episodePages) {
			const flattenEpisodes = episodePages.pages.flatMap(
				(page: EpisodeResponse) => page.episodes
			)
			setEpisodes(flattenEpisodes)
		}
	}, [episodePages])

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
			<div className="mt-2 flex justify-center">
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<Button disabled={!hasNextPage} onClick={handleRefetch}>
						Load More
					</Button>
				)}
			</div>
		</>
	)
}

export default EpisodesTable
