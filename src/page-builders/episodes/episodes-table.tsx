import React, { useEffect, useMemo, useState } from 'react'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { useCreateTable } from '@/hooks/use-create-table'
import { usePageState } from '@/hooks/use-page-state'
import ActionAlert from '@/page-builders/episodes/action-alert'
import SkeletonBuilder from '@/page-builders/episodes/episode-skeleton'
import Filters from '@/page-builders/episodes/filters'
import InventForm from '@/page-builders/episodes/invent-form'
import EpisodesPagination from '@/page-builders/episodes/pagination'
import { useEpisodeStore } from '@/store/episode-store'
import { flexRender } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils/helpers'

import { EEpisodeHeaderKeys } from '@/types/episode-type'

const EpisodesTable = () => {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const { setInventIndex, setIsInventOpen } = useEpisodeStore()
	const { currentPage, search, limit } = usePageState()
	const [searchedRow, setSearchedRow] = useState<number | null>(null)
	const { data, isLoading: isEpisodesLoading } = useEpisodesData(
		search,
		currentPage,
		limit
	)
	const tableData = useMemo(() => data?.results?.data ?? [], [data])
	const { table, columnSize, isWriter } = useCreateTable(tableData)

	useEffect(() => {
		if (searchedRow && !isEpisodesLoading) {
			const rowElement = document.getElementById(`row-${searchedRow - 1}`)
			if (!rowElement) {
				return
			}
			rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
			const scrollDistance = Math.abs(
				rowElement.getBoundingClientRect().top - window.innerHeight / 2
			)
			const timeoutDuration = Math.min(Math.max(scrollDistance / 2, 300), 1500)

			setTimeout(() => {
				rowElement.classList.remove('animate-slow-flash')
				void rowElement.offsetWidth
				rowElement.classList.add('animate-slow-flash')
			}, timeoutDuration)

			setSearchedRow(null)
		}
	}, [searchedRow, isEpisodesLoading])

	return (
		<>
			<div className="flex gap-3">
				<Filters
					disabled={!isWriter}
					table={table}
					totalEpisodes={data?.count}
					setSearchedRow={setSearchedRow}
				/>
			</div>
			<Table className="rounded-md border">
				<TableHeader className="sticky top-14 z-10 bg-background">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className="after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border"
									>
										<If condition={!header.isPlaceholder}>
											<div
												className={cn(
													header.column.getCanSort() &&
														'flex cursor-pointer select-none items-center'
												)}
												{...(header.id !==
												(EEpisodeHeaderKeys.SERIAL_NUMBER as string)
													? {
															onClick: header.column.getToggleSortingHandler(),
														}
													: {})}
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
										</If>
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					<IfElse condition={isEpisodesLoading}>
						<If>
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={columnSize + 1}>
									<SkeletonBuilder count={limit} className="h-8" />
								</TableCell>
							</TableRow>
						</If>
						<Else>
							<IfElse condition={!!table.getRowModel().rows?.length}>
								<If>
									{table.getRowModel().rows.map((row, rowIndex) => (
										<React.Fragment key={row.id}>
											<TableRow
												id={`row-${row.id}`}
												className={cn({ selected: row.getIsSelected() })}
											>
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

											{hoverIndex === rowIndex && isWriter && (
												<TableRow className="relative border-none">
													<TableCell className="relative p-0">
														<Button
															title="Invent episode"
															className="absolute z-10 h-auto -translate-y-1/2 rounded-full bg-primary p-1"
															disabled={!isWriter}
															onClick={() => {
																setIsInventOpen(true)
																setInventIndex(rowIndex)
															}}
														>
															<Plus size={12} />
														</Button>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									))}
								</If>
								<Else>
									<TableRow className="p-5 text-center">
										<TableCell colSpan={columnSize + 1}>
											<p className="text-gray-500">No Episodes found</p>
										</TableCell>
									</TableRow>
								</Else>
							</IfElse>
						</Else>
					</IfElse>
				</TableBody>
			</Table>
			<EpisodesPagination
				totalPages={data ? Math.ceil(data.count / limit) : 0}
			/>
			<ActionAlert />
			<InventForm />
		</>
	)
}

export default EpisodesTable
