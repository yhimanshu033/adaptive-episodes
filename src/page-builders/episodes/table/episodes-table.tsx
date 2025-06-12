import React, { useEffect, useMemo, useState } from 'react'
import { EImportStatus } from '@/constants/story-constants'
import { useEpisodesData } from '@/hooks/query/use-episode-data'
import { useCreateTable } from '@/hooks/use-create-table'
import useIsGerman from '@/hooks/use-is-german'
import { usePageState } from '@/hooks/use-page-state'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { MagicBookIcon } from '@/icons/magic-book-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { UploadIcon } from '@/icons/upload-icon'
import AdaptationContainer from '@/page-builders/episodes/adaptation-container'
import ActionAlert from '@/page-builders/episodes/dialogs/action-alert'
import InventForm from '@/page-builders/episodes/dialogs/invent-form'
import EpisodesPagination from '@/page-builders/episodes/pagination/pagination'
import ShareAccessDialog from '@/page-builders/episodes/shared-access-dialog/share-access-dialog'
import Filters from '@/page-builders/episodes/table/filters'
import SelectionActions from '@/page-builders/episodes/table/selection-actions'
import { useEpisodeStore } from '@/store/episode-store'
import { flexRender } from '@tanstack/react-table'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/aural-ui/tooltip'
import AuthWrapper from '@/components/auth-wrapper'
import IfElse, { Else, If } from '@/components/if-else'
import StoryDetails from '@/components/story-details'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

import { ERole } from '@/types/admin-types'
import { EEpisodeHeaderKeys } from '@/types/episode-type'

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

	if (
		initialStoryData?.is_original &&
		!isEpisodesLoading &&
		!tableData.length
	) {
		return <AdaptationContainer />
	}

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<StoryDetails
					isLoading={isEpisodesLoading}
					titleClassname="text-xl"
					imageSize={40}
				/>
				<div className="flex items-center gap-2">
					<Filters
						totalEpisodes={data?.count}
						setSearchedRow={setSearchedRow}
						isLoading={isEpisodesLoading}
					/>
					<AuthWrapper role={ERole.ADMIN}>
						<Button
							variant="secondary"
							className="h-11"
							onClick={() => setIsShareAccessDialogOpen(true)}
						>
							<UploadIcon width={20} height={20} />
						</Button>
					</AuthWrapper>
					<If condition={!isGerman}>
						<Button variant="secondary" className="font-fm-brand h-11 text-sm">
							<MagicBookIcon width={20} height={20} />
							<span>Adapt</span>
						</Button>
					</If>
					{/* @ts-expect-error data count */}
					<If condition={data?.count > 0}>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="primary"
									className="font-fm-brand h-11 text-sm"
								>
									<PlusIcon width={20} height={20} />
									<span>Add</span>
									<ChevronDownIcon width={20} height={20} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mr-8">
								<DropdownMenuItem
									onClick={() => {
										setIsInventOpen(true)
										setInventIndex((data?.count ?? 0) - 1)
									}}
								>
									<PlusIcon />
									<span>Add new episode</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<PlusIcon />
									<span>Import new episode</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</If>
				</div>
			</div>
			<Divider className="mt-4" />
			<SelectionActions table={table} />
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										<If condition={!header.isPlaceholder}>
											<div
												className={cn(
													header.column.getCanSort() &&
														'font-fm-brand text-fm-tertiary flex cursor-pointer items-center text-xs uppercase'
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
									{Array.from({ length: limit }).map(() => (
										<Skeleton key={`skeleton-${limit}`} className="mb-3 h-12" />
									))}
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
													<TableCell className="absolute -top-8 -left-10">
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="secondary"
																	size="sm"
																	disabled={!isWriter}
																	className="rounded-full"
																	onClick={() => {
																		setIsInventOpen(true)
																		setInventIndex(rowIndex)
																	}}
																>
																	<PlusIcon width={16} height={16} />
																</Button>
															</TooltipTrigger>
															<TooltipContent>Invent Episode</TooltipContent>
														</Tooltip>
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
													className="my-2"
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
			<PaginationProvider totalItems={data ? data.count : 0}>
				<If condition={!!data}>
					<EpisodesPagination />
				</If>
			</PaginationProvider>
			<ActionAlert />
			<InventForm />
			<ShareAccessDialog />
		</>
	)
}

export default EpisodesTable
