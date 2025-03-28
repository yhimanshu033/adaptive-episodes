import React, { useMemo } from 'react'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { useProjectUsersTable } from '@/hooks/use-project-users-table'
import { flexRender } from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils/helpers'

import SkeletonBuilder from '../episodes/episode-skeleton'
import SearchTable from './search-table'

const MembersTable = () => {
	const { data, isLoading: isMembersLoading } = useUserMembersQuery()
	const memberData = useMemo(() => data?.members ?? [], [data])
	const { table, columnSize, setGlobalFilter } =
		useProjectUsersTable(memberData)

	return (
		<>
			<SearchTable setGlobalFilter={setGlobalFilter} />
			<ScrollArea className="relative mt-2 flex h-[48vh] w-full flex-col rounded-md border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-background">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="flex-1 text-center after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border"
									>
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
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{isMembersLoading ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={columnSize + 1}>
									<SkeletonBuilder count={20} className="h-8" />
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
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
							<TableRow className="p-5 text-center">
								<TableCell colSpan={columnSize + 1}>
									<p className="text-gray-500">No member found</p>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollArea>
		</>
	)
}

export default MembersTable
