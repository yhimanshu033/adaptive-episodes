import React, { useRef, useState } from 'react'
import { RowSelectionState, Table } from '@tanstack/react-table'
import { Merge, Search } from 'lucide-react'

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
import { Input } from '@/components/ui/input'

import { TEpisode } from '@/types/episode-type'

const Filters = ({
	setEpisodeFilter,
	rowSelection,
	table,
}: {
	rowSelection: RowSelectionState
	setEpisodeFilter: (episode: string) => void
	table: Table<TEpisode>
}) => {
	const [episodeSearch, setEpisodeSearch] = useState<string>('')
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
	const selectedRows = Object.fromEntries(
		Object.entries(rowSelection).filter(([key]) => /^[0-9]+$/.test(key))
	)

	const alertContentRef = useRef<{
		description: string
		notValid?: boolean
	} | null>(null)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setEpisodeFilter(episodeSearch)
	}

	const handleMerge = () => {
		const selectedRowData = table
			.getRowModel()
			.rows.filter((row) => selectedRows[row.id])
			.map((row) => row.original)

		const isStatusSame = selectedRowData.every(
			(row) => row.status === selectedRowData[0].status
		)

		if (!isStatusSame) {
			alertContentRef.current = {
				description: `Cannot merge episodes with different statuses`,
				notValid: true,
			}
		} else {
			alertContentRef.current = {
				description: 'Selected episodes will get merged',
			}
		}
		setIsDialogOpen(true)
	}

	const handleConfirm = () => {
		console.log('confirm')
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="mb-2 flex flex-1 items-center gap-2"
			>
				<Input
					placeholder="Search Episode"
					className="border"
					onChange={(e) => setEpisodeSearch(e.target.value)}
				/>
				<Button type="submit" size="icon">
					<Search size={16} />
				</Button>
			</form>
			{Object.keys(selectedRows).length > 1 ? (
				<Button size="icon" onClick={handleMerge}>
					<Merge size={16} />
				</Button>
			) : null}
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
		</>
	)
}

export default Filters
