import React from 'react'
import { statuses } from '@/constants/episodes-constants'
import { Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { EpisodeType } from '@/types/episode-type'

const Filters = ({
	table,
	uniqueWriters,
}: {
	table: Table<EpisodeType>
	uniqueWriters: string[]
}) => {
	return (
		<div className="mb-4 flex flex-wrap gap-2">
			{table.getAllColumns().map((column) => {
				if (column.id === 'author') {
					return (
						<div
							key={column.id}
							className="min-w-[200px] flex-1 rounded-md border"
						>
							<Select
								onValueChange={(value) =>
									column.setFilterValue(value === 'all' ? '' : value)
								}
								value={(column.getFilterValue() as string) ?? ''}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Filter Writer" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Writers</SelectItem>
									{uniqueWriters.map((writer) => (
										<SelectItem key={writer} value={writer}>
											{writer}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				}
				if (column.id === 'status') {
					return (
						<div
							key={column.id}
							className="min-w-[200px] flex-1 rounded-md border"
						>
							<Select
								onValueChange={(value) =>
									column.setFilterValue(value === 'all' ? '' : value)
								}
								value={(column.getFilterValue() as string) ?? ''}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Filter Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									{statuses.map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				}
				if (['episode_name', 'last_updated'].includes(column.id)) {
					return (
						<div
							key={column.id}
							className="min-w-[200px] flex-1 rounded-md border"
						>
							<Input
								placeholder={`Filter ${column.id}`}
								value={(column.getFilterValue() ?? '') as string}
								onChange={(e) => column.setFilterValue(e.target.value)}
								className="placeholder:text-foreground"
							/>
						</div>
					)
				}
				return null
			})}
		</div>
	)
}

export default Filters
