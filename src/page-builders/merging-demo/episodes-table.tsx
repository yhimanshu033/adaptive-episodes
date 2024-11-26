/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { episodeLimit, statuses } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { mergedEpisodes } from '@/mock-data/episodes'
import {
	ColumnDef,
	ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import { useForm } from 'react-hook-form'

import EditableText from '@/components/editable-text'
import { Loader } from '@/components/loader'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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

type FormData = {
	title: string
}

const EpisodesTable = () => {
	const [episodes, setEpisodes] = useState<TEpisode[]>(mergedEpisodes)
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [episodeFilter, setEpisodeFilter] = useState<string>('')
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
	const [isInventOpen, setIsInventOpen] = useState<boolean>(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const currentSelectedIndex = useRef<number | null>(null)

	const form = useForm<FormData>({
		defaultValues: {
			title: '',
		},
	})

	const selectedEpisodeRef = useRef<{
		episodes: TEpisode[]
		status: EStatus
	} | null>(null)

	const alertContentRef = useRef<{
		description: string
		notValid?: boolean
	} | null>(null)

	const router = useRouter()
	const pathname = usePathname()

	const { data } = useEpisodesData(episodeFilter, currentPage)
	const { saveEpisodeMutation } = useEpisodeHook()

	const hasConsistentStatus = (selectedRows: TEpisode[]) =>
		selectedRows.every((row) => row.status === selectedRows[0].status)

	const handleStatusChange = (episode: TEpisode, status: EStatus) => {
		const selectedRows = table
			.getRowModel()
			.rows.filter((row) => rowSelection[row.id])
			.map((row) => row.original)

		selectedEpisodeRef.current = {
			episodes: selectedRows.length ? selectedRows : [episode],
			status,
		}
		if (selectedRows.length <= 1) {
			alertContentRef.current = {
				description: `Status of selected episode will switch to ${status}`,
			}
		} else if (hasConsistentStatus(selectedRows)) {
			alertContentRef.current = {
				description: `Status of ${selectedRows.length} selected episodes will change to ${status}`,
			}
		} else {
			alertContentRef.current = {
				description: `All selected episodes must have the same current status to update.`,
				notValid: true,
			}
		}
		setIsDialogOpen(true)
	}

	const handleConfirm = async () => {
		if (selectedEpisodeRef.current) {
			const { episodes, status } = selectedEpisodeRef.current
			await Promise.all(
				episodes.map((episode) => {
					console.log({
						text: 'Status update',
						statusChange: status,
						selectedChapterId: episode.parent ?? episode.id,
					})
					return saveEpisodeMutation.mutateAsync({
						text: 'Status update',
						statusChange: status,
						selectedChapterId: episode.parent ?? undefined,
					})
				})
			)
		}
	}

	const handleWriterChange = (episodeId: number, newWriter: string) => {
		// setEpisodes(
		// 	episodes.map((episode) =>
		// 		episode.id === episodeId ? { ...episode, writer: newWriter } : episode
		// 	)
		// )
		console.log(episodeId, newWriter)
	}

	const handleClick = (episodeId: number) => {
		router.push(`${pathname}/${episodeId}/editor`)
	}

	const handleAddEpisode = (data: FormData) => {
		const position = currentSelectedIndex.current || 0
		console.log('handleAddEpisode')
		const newEpisode: TEpisode = {
			id: Date.now(), // Unique ID
			seq_number: position + 1,
			chapter_title: data.title || 'New Episode',
			status: BASE_STATUS,
			update_time: new Date().toISOString(),
			word_count: 0,
			episodes: [],
			comments: '',
			context: '',
			create_time: '',
			file_url: '',
			latest_version: 1,
			parent: null,
			project: 1,
			props: {
				llm_memories: { beatsheet: '', context: '', loglines: '', summary: '' },
			},
			translation_url: '',
		}

		// Insert the new episode into the array at the desired position
		const updatedEpisodes = [...episodes]
		updatedEpisodes.splice(position, 0, newEpisode)

		// Update the episodes and reset hoverIndex
		setEpisodes(updatedEpisodes)
		setHoverIndex(null)
		setIsInventOpen(false)
	}

	const handleMouseEnter = (index: number) => {
		setHoverIndex(index)
	}

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
			cell: ({ row }) =>
				!row.depth && Number(row.id) + (currentPage - 1) * 10 + 1,
		},
		{
			accessorKey: 'chapter_title',
			header: 'Title',
			cell: ({ row }) => (
				<div
					className="flex cursor-pointer items-center gap-2 font-medium"
					onClick={() => handleClick(row.original.parent || row.original.id)}
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
			cell: ({ row }) => {
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
							handleStatusChange(row.original, value as EStatus)
						}
						disabled={!isSelected && Object.keys(rowSelection).length > 0}
					>
						<SelectTrigger className="w-32">
							<SelectValue>{latestStatus}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{statuses.map((status, index) => (
								<SelectItem
									disabled={index < latestIndex || index > latestIndex + 1}
									key={status}
									value={status}
								>
									{status}
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
					<EditableText
						key={row.original.id}
						text={row.getValue('writer') || 'Anonymous'}
						isEditable
						onComplete={handleWriterChange.bind(null, row.original.id)}
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
	]

	const table = useReactTable({
		data: episodes,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		getExpandedRowModel: getExpandedRowModel(),
		getSubRows: (row) => row.episodes,
		onExpandedChange: setExpanded,
		state: {
			sorting,
			rowSelection,
			expanded,
		},
	})

	// useEffect(() => {
	// 	if (data) setEpisodes(data?.results.data)
	// }, [data])
	if (saveEpisodeMutation.isPending)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	return (
		<>
			<div className="flex gap-2">
				<Filters {...{ setEpisodeFilter, rowSelection, table }} />
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
							table.getRowModel().rows.map((row, rowIndex) => (
								<React.Fragment key={row.id}>
									{/* Hover area for adding an episode above this row */}
									{hoverIndex === rowIndex && (
										<tr className="group relative hover:bg-muted-foreground/10">
											<td
												colSpan={columns.length}
												className="relative w-full p-0"
											>
												<div
													title="Invent episode"
													className="absolute top-1/2 z-10 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary text-white group-hover:visible"
													onClick={() => {
														setIsInventOpen(true)
														currentSelectedIndex.current = rowIndex
													}}
												>
													+
												</div>
											</td>
										</tr>
									)}

									<TableRow className={cn({ selected: row.getIsSelected() })}>
										{/* Render cells */}
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												onMouseEnter={
													cell.column.id === 'select-col' && !row.depth
														? () => handleMouseEnter(rowIndex)
														: () => setHoverIndex(null)
												}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								</React.Fragment>
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
				totalPages={data ? Math.ceil(data.count / episodeLimit) : 0}
			/>
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Selection</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription>
						{alertContentRef.current?.description}
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						{!alertContentRef.current?.notValid && (
							<AlertDialogAction onClick={handleConfirm}>
								Confirm
							</AlertDialogAction>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog onOpenChange={setIsInventOpen} open={isInventOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invent New Episode</DialogTitle>
						<DialogDescription>
							Enter the details for the new episode.
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleAddEpisode)}
							className="space-y-4"
						>
							{/* Episode Title Field */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Episode Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter Episode Title"
												id="title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Submit Button */}
							<div className="text-right">
								<Button type="submit" size="sm" className="mt-4 font-bold">
									Create
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default EpisodesTable
