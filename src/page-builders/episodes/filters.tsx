import React, { useRef, useState } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { Table } from '@tanstack/react-table'
import { Merge, Search, Split } from 'lucide-react'

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
import Spinner from '@/components/ui/spinner'

import { TEpisode } from '@/types/episode-type'

const Filters = ({
	setEpisodeFilter,
	table,
}: {
	setEpisodeFilter: (episode: string) => void
	table: Table<TEpisode>
}) => {
	const [episodeSearch, setEpisodeSearch] = useState<string>('')
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
	const {
		episodesMergeMutation: { mutate: mergeMutate, isPending: isMerging },
		episodeUnmergeMutation: { mutate: unmergeMutate, isPending: isUnmerging },
	} = useEpisodeHook()

	const alertContentRef = useRef<{
		action?: 'merge' | 'unmerge'
		description: string
	} | null>(null)

	const selectedRowData = table.getSelectedRowModel().rows

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setEpisodeFilter(episodeSearch)
	}

	const handleMerge = () => {
		const isStatusSame = selectedRowData.every(
			(row) => row.original.status === selectedRowData[0].original.status
		)

		const isContinuous = selectedRowData.every(
			(row, index) =>
				index === 0 ||
				row.original.seq_number -
					selectedRowData[index - 1].original.seq_number ===
					1
		)

		if (!isStatusSame) {
			alertContentRef.current = {
				description: `Cannot merge episodes with different statuses`,
			}
		} else if (!isContinuous) {
			alertContentRef.current = {
				description: 'Selected Episodes are non sequential',
			}
		} else {
			alertContentRef.current = {
				description: 'Selected episodes will get merged',
				action: 'merge',
			}
		}
		setIsDialogOpen(true)
	}

	const handleUnmerge = () => {
		if (!selectedRowData[0].getCanExpand()) {
			alertContentRef.current = {
				description: 'Please select a merged episode',
			}
		} else {
			alertContentRef.current = {
				description: 'Selected Episode will get unmerged',
				action: 'unmerge',
			}
		}
		setIsDialogOpen(true)
	}

	const handleConfirm = () => {
		if (alertContentRef.current?.action === 'merge') {
			const selectedEpisodeIds = selectedRowData.map((row) => row.original.id)
			mergeMutate(selectedEpisodeIds)
		} else {
			unmergeMutate(selectedRowData[0].original.id)
		}
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
			<Button
				size="icon"
				disabled={Object.keys(selectedRowData).length <= 1 || isMerging}
				onClick={handleMerge}
				title="Merge episodes"
			>
				{isMerging ? <Spinner size={16} /> : <Merge size={16} />}
			</Button>
			<Button
				size="icon"
				disabled={selectedRowData.length !== 1 || isUnmerging}
				onClick={handleUnmerge}
				title="Unmerge episodes"
			>
				{isUnmerging ? <Spinner size={16} /> : <Split size={16} />}
			</Button>
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
						{alertContentRef.current?.action && (
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
