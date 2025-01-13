'use client'

import React from 'react'

import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import type { WriterTableProps } from '@/types/admin-types'

export function WriterThroughputTable({ writers }: WriterTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Writer</TableHead>
						<TableHead className="text-right">CMS Throughput/day</TableHead>
						<TableHead className="text-right">CMS Monthly</TableHead>
						<TableHead className="text-right">Writing Days/Week</TableHead>
						<TableHead className="text-right">Total Scripts</TableHead>
						<TableHead className="text-right">Total Hours</TableHead>
						<TableHead className="text-right">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{writers.map((writer) => (
						<TableRow key={writer.id}>
							<TableCell className="font-medium">{writer.name}</TableCell>
							<TableCell className="text-right">
								{writer.cmsThroughputDay.toFixed(2)}
							</TableCell>
							<TableCell className="text-right">
								{writer.cmsThroughputMonth.toFixed(2)}
							</TableCell>
							<TableCell className="text-right">
								{writer.writingDaysPerWeek}
							</TableCell>
							<TableCell className="text-right">
								{writer.totalScripts}
							</TableCell>
							<TableCell className="text-right">{writer.totalHours}</TableCell>
							<TableCell className="text-right">
								<Badge variant={writer.isWorking ? 'default' : 'secondary'}>
									{writer.isWorking ? 'Working' : 'Off'}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
