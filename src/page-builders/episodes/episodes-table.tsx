/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useMemo, useState } from 'react'
import { episodeLimit } from '@/constants/episodes-constants'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { useCreateTable } from '@/hooks/use-create-table'
import { usePageState } from '@/hooks/use-page-state'
import {
	setInventIndex,
	setIsInventOpen,
	useEpisodeStore,
} from '@/store/episode-store'
import { flexRender } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import ActionAlert from './action-alert'
import SkeletonBuilder from './episode-skeleton'
import Filters from './filters'
import InventForm from './invent-form'
import EpisodesPagination from './pagination'

const EpisodesTable = () => {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const { episodeSearch } = useEpisodeStore()
	const { currentPage } = usePageState()
	const { data } = useEpisodesData(episodeSearch, currentPage)
	const tableData = useMemo(() => data?.results?.data ?? [], [data])
	const { table, columnSize } = useCreateTable(tableData)

	return (
		<>
			<div className="flex gap-2">
				<Filters table={table} />
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
									<TableRow className={cn({ selected: row.getIsSelected() })}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												onMouseEnter={
													cell.column.id === 'select-col' && !row.depth
														? () => setHoverIndex(rowIndex)
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

									{hoverIndex === rowIndex && (
										<TableRow className="relative border-none">
											<TableCell className="relative p-0">
												<div
													title="Invent episode"
													className="absolute z-10 -translate-y-1/2 cursor-pointer rounded-full bg-primary p-1"
													onClick={() => {
														setIsInventOpen(true)
														setInventIndex(rowIndex)
													}}
												>
													<Plus size={12} />
												</div>
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>
							))
						) : (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={columnSize + 1}>
									<SkeletonBuilder count={5} className="h-8" />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollArea>
			<EpisodesPagination
				totalPages={data ? Math.ceil(data.count / episodeLimit) : 0}
			/>
			<ActionAlert />
			<InventForm />
		</>
	)
}

export default EpisodesTable
