import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeData from '@/hooks/query/use-episode-data'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import EditableText from '@/components/editable-text'
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

import { EpisodeType } from '@/types/episode-type'

import SkeletonBuilder from './episode-skeleton'
import Filters from './filters'
import EpisodesPagination from './pagination'

const EpisodesTable = () => {
	const [episodes, setEpisodes] = useState<EpisodeType[]>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [episodeFilter, setEpisodeFilter] = useState<string>('')

	const router = useRouter()
	const pathname = usePathname()

	const { data: episodePage } = useEpisodeData(currentPage, episodeFilter)

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

	const columns: ColumnDef<EpisodeType>[] = [
		{
			accessorKey: 'serialNumber',
			header: '#',
			cell: ({ row }) => row.index + (currentPage - 1) * 10 + 1,
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
		onSortingChange: setSorting,
		pageCount: episodePage?.totalPages || 0,
		state: {
			sorting,
		},
	})
	useEffect(() => {
		setEpisodes(episodePage?.episodes || [])
	}, [episodePage])

	return (
		<>
			<Filters setEpisodeFilter={setEpisodeFilter} />
			<ScrollArea className="overflow-auto-y relative flex max-h-[calc(100vh-300px)] w-full flex-col rounded-md border">
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
				totalPages={episodePage?.totalPages || 0}
			/>
		</>
	)
}

export default EpisodesTable
