import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { useCreateTable } from '@/hooks/use-create-table'
import useEpisodeTable from '@/hooks/use-episode-table'
import useIsGerman from '@/hooks/use-is-german'
import { usePageState } from '@/hooks/use-page-state'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import ChevronLeftIcon from '@/icons/chevron-left-icon'
import { MagicBookIcon } from '@/icons/magic-book-icon'
import { MaintenanceIcon } from '@/icons/maintenance-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { UploadIcon } from '@/icons/upload-icon'
import ActionAlert from '@/page-builders/episodes/dialogs/action-alert'
import InventForm from '@/page-builders/episodes/dialogs/invent-form'
import EpisodesPagination from '@/page-builders/episodes/pagination/pagination'
import ShareAccessDialog from '@/page-builders/episodes/shared-access-dialog/share-access-dialog'
import AdaptationContainer from '@/page-builders/episodes/table/adaptation-container'
import AddEpisode from '@/page-builders/episodes/table/add-episode'
import EpisodeEmpty from '@/page-builders/episodes/table/episode-empty'
import Filters from '@/page-builders/episodes/table/filters'
import SelectionActions from '@/page-builders/episodes/table/selection-actions'
import { useEpisodeStore } from '@/store/episode-store'
import { flexRender } from '@tanstack/react-table'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import { PaginationProvider } from '@/components/aural-ui/pagination'
import { Skeleton } from '@/components/aural-ui/skelton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/aural-ui/table'
import AuthWrapper from '@/components/auth-wrapper'
import IfElse, { Else, If } from '@/components/if-else'
import StoryDetails from '@/components/story-details'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

import { ERole } from '@/types/admin-types'
import {
	EEpisodeHeaderKeys,
	episodeTableColumnWidths,
} from '@/types/episode-type'

const EpisodesTable = () => {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const { setInventIndex, setIsInventOpen, setIsShareAccessDialogOpen } =
		useEpisodeStore()
	const isGerman = useIsGerman()
	const { initialStoryData } = useEpisodeTableContext()
	const { currentPage, search, limit } = usePageState()
	const [searchedRow, setSearchedRow] = useState<number | null>(null)
	const { data, isLoading: isEpisodesLoading } = useEpisodesData(
		search,
		currentPage,
		limit
	)
	const tableData = useMemo(
		() => data?.results?.data ?? [],
		[data?.results?.data]
	)
	const { table, columnSize, isWriter, editingRowId } =
		useCreateTable(tableData)

	const { handleEpisodeInfo } = useEpisodeTable()

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

	useEffect(() => {
		if (table.getSelectedRowModel().rows.length > 0) {
			setHoverIndex(null)
		}
	}, [table.getSelectedRowModel().rows.length])

	if (initialStoryData?.is_original && !initialStoryData.episode_count) {
		return <AdaptationContainer />
	}

	return (
		<>
			<IfElse condition={!initialStoryData?.episode_count}>
				<If>
					<If condition={!isEpisodesLoading}>
						<StoryDetails titleClassname="text-xl" imageSize={40} />
						<Divider className="mt-6 mb-10" variant="secondary" />
					</If>
					<EpisodeEmpty
						initialStoryData={initialStoryData}
						setInventIndex={setInventIndex}
						setIsInventOpen={setIsInventOpen}
						isLoading={isEpisodesLoading}
					/>
				</If>
				<Else>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link
								href="/projects"
								role="button"
								className={cn(
									iconButtonVariants({
										variant: 'outlined',
										shape: 'square',
										className: 'size-10 rounded',
									}),
									'opacity-80 hover:opacity-100'
								)}
							>
								<ChevronLeftIcon
									width={20}
									height={20}
									className="flex shrink-0"
								/>
							</Link>

							<StoryDetails imageSize={40} titleClassname="text-xl" />
						</div>
						<div className="flex items-center gap-2">
							<Filters
								totalEpisodes={data?.count}
								setSearchedRow={setSearchedRow}
								isLoading={isEpisodesLoading}
							/>
							<AuthWrapper role={ERole.ADMIN}>
								<Button
									variant="secondary"
									className="border-fm-divider-secondary h-11 border"
									noise="low"
									onClick={() => setIsShareAccessDialogOpen(true)}
								>
									<UploadIcon width={20} height={20} />
								</Button>
							</AuthWrapper>
							<If condition={!isGerman}>
								<Button
									variant="secondary"
									className="font-fm-brand h-11 text-sm"
									onClick={() =>
										handleEpisodeInfo({
											icon: <MaintenanceIcon width={20} height={20} />,
											description: 'Global adaptation feature coming soon!',
											title: 'Coming Soon',
										})
									}
								>
									<MagicBookIcon width={20} height={20} />
									<span>Adapt</span>
								</Button>
							</If>
							<AuthWrapper role={ERole.WRITER}>
								<AddEpisode episodeCount={data?.count || 0} />
							</AuthWrapper>
						</div>
					</div>
					<Divider className="mt-6 mb-10" variant="secondary" />
					<SelectionActions table={table} />
					<Table
						className={cn('bg-fm-transparent table-fixed', {
							'pointer-events-none': editingRowId,
						})}
						onMouseLeave={() => setHoverIndex(null)}
					>
						<TableHeader className="bg-fm-surface-primary">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												style={{
													width:
														episodeTableColumnWidths[
															header.id as EEpisodeHeaderKeys
														] || 'auto',
												}}
											>
												<If condition={!header.isPlaceholder}>
													<div
														className={cn(
															header.column.getCanSort() &&
																'font-fm-brand text-fm-tertiary flex cursor-pointer items-center text-xs uppercase'
														)}
														{...(header.id !==
														(EEpisodeHeaderKeys.SERIAL_NUMBER as string)
															? {
																	onClick:
																		header.column.getToggleSortingHandler(),
																}
															: {})}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: (
																<ChevronDownIcon className="ml-2 size-4 rotate-180" />
															),
															desc: <ChevronDownIcon className="ml-2 size-4" />,
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
									<TableRow>
										<TableCell colSpan={columnSize + 1}>
											{Array.from({ length: limit }).map((_, index) => (
												<Skeleton
													key={`skeleton-${index}`}
													className="mb-3 h-12"
												/>
											))}
										</TableCell>
									</TableRow>
								</If>
								<Else>
									<IfElse condition={!!table.getRowModel().rows?.length}>
										<If>
											{table.getRowModel().rows.map((row, rowIndex) => {
												const anyRowSelected =
													table.getSelectedRowModel().rows.length > 0
												const isHoverable = !anyRowSelected && isWriter
												const isHovered = hoverIndex === rowIndex
												const shouldShowHoverAction = isHoverable && isHovered

												const handleRowMouseMove = (
													e: React.MouseEvent<HTMLTableRowElement>
												) => {
													if (!isHoverable) {
														return
													}

													const rect = e.currentTarget.getBoundingClientRect()
													const offsetY = e.clientY - rect.top
													const threshold = 20

													if (
														rect.height - offsetY <= threshold &&
														!row.depth
													) {
														setHoverIndex(rowIndex)
													} else {
														setHoverIndex(null)
													}
												}

												const handleRowMouseLeave = () => {
													if (!isHoverable) {
														return
													}
													setHoverIndex(null)
												}

												const handleInventMouseEnter = () => {
													if (!isHoverable) {
														return
													}
													setHoverIndex(rowIndex)
												}

												return (
													<React.Fragment key={row.id}>
														<TableRow
															id={`row-${row.id}`}
															className={cn(
																'border-fm-divider-brand-secondary transition-all duration-200',
																{
																	selected: row.getIsSelected(),
																	'bg-fm-surface-primary': rowIndex % 2 !== 0,
																	'bg-fm-secondary-50': row.getIsSelected(),
																	'bg-fm-surface-frosted/20 border-b-[0.5px]':
																		shouldShowHoverAction,
																}
															)}
															onMouseMove={handleRowMouseMove}
															onMouseLeave={handleRowMouseLeave}
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

														{isWriter && (
															<TableRow
																className={cn(
																	'relative border-none p-0 transition-all duration-300',
																	{
																		'opacity-0': !shouldShowHoverAction,
																		'opacity-100': shouldShowHoverAction,
																	}
																)}
																onMouseLeave={handleRowMouseLeave}
															>
																<TableCell className="absolute -bottom-4 -left-5 p-0">
																	<Button
																		variant="secondary"
																		size="sm"
																		disabled={!isWriter}
																		className="border-fm-divider-secondary w-10 rounded-full border"
																		innerClassName="border border-fm-divider-secondary"
																		noise="low"
																		onClick={() => {
																			setIsInventOpen(true)
																			setInventIndex(rowIndex)
																		}}
																		onMouseEnter={handleInventMouseEnter}
																		tooltip={
																			shouldShowHoverAction && 'Invent Episode'
																		}
																	>
																		<PlusIcon
																			width={16}
																			height={16}
																			className="flex shrink-0"
																		/>
																	</Button>
																</TableCell>
															</TableRow>
														)}
													</React.Fragment>
												)
											})}
										</If>
										<Else>
											<TableRow className="p-5 text-center">
												<TableCell colSpan={columnSize + 1}>
													<div className="flex flex-col items-center justify-center py-8">
														<p className="text-fm-tertiary text-sm">
															No episodes found for the current search criteria
														</p>
														<p className="text-fm-muted mt-1 text-xs">
															Try adjusting your filters or search terms
														</p>
													</div>
												</TableCell>
											</TableRow>
										</Else>
									</IfElse>
								</Else>
							</IfElse>
						</TableBody>
					</Table>
					{data && data.count > 0 && (
						<PaginationProvider
							initialPageSize={limit}
							totalItems={data.count}
							initialPage={currentPage}
						>
							<EpisodesPagination />
						</PaginationProvider>
					)}
				</Else>
			</IfElse>
			<ActionAlert table={table} />
			<InventForm />
			<ShareAccessDialog />
		</>
	)
}

export default EpisodesTable
