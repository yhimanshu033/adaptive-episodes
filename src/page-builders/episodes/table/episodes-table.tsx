import React, { useEffect, useMemo, useState } from 'react'
import { EImportStatus } from '@/constants/story-constants'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { useCreateTable } from '@/hooks/use-create-table'
import { usePageState } from '@/hooks/use-page-state'
import ActionAlert from '@/page-builders/episodes/dialogs/action-alert'
import InventForm from '@/page-builders/episodes/dialogs/invent-form'
import EpisodesPagination from '@/page-builders/episodes/pagination/pagination'
import SkeletonBuilder from '@/page-builders/episodes/table/episode-skeleton'
import Filters from '@/page-builders/episodes/table/filters'
import SelectionActions from '@/page-builders/episodes/table/selection-actions'
import { useEpisodeStore } from '@/store/episode-store'
import { flexRender } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

import AuthWrapper from '@/components/auth-wrapper'
import IfElse, { Else, If } from '@/components/if-else'
import StoryDetails from '@/components/story-details'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

import { ERole } from '@/types/admin-types'
import { EEpisodeHeaderKeys } from '@/types/episode-type'

import AdminManageProject from '../buttons/admin-manage-project'

const EpisodesTable = () => {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const { setInventIndex, setIsInventOpen } = useEpisodeStore()
	const { initialStoryData } = useEpisodeTableContext()
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
			<div className="mb-4 flex items-center justify-between">
				<StoryDetails titleClassname="text-xl" imageSize={60} />
				<div className="flex gap-2">
					<Filters
						totalEpisodes={data?.count}
						setSearchedRow={setSearchedRow}
					/>
					<AuthWrapper role={ERole.ADMIN}>
						<AdminManageProject />
					</AuthWrapper>
				</div>
			</div>
			<SelectionActions table={table} />
			<Table className="rounded-md">
				<TableHeader className="bg-card sticky top-14 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} className="">
										<If condition={!header.isPlaceholder}>
											<div
												className={cn(
													header.column.getCanSort() &&
														'flex cursor-pointer items-center select-none'
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
												className={cn({
													selected: row.getIsSelected(),
													'bg-card': rowIndex % 2,
												})}
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
															tooltip="Invent episode"
															className="bg-primary absolute z-10 h-auto -translate-y-1/2 rounded-full p-1"
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
											{initialStoryData?.status === EImportStatus.IMPORTING ? (
												<p>Importing Story ...</p>
											) : (
												<Button
													onClick={() => {
														setIsInventOpen(true)
														setInventIndex(-1)
													}}
												>
													Create New Episode
												</Button>
											)}
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
