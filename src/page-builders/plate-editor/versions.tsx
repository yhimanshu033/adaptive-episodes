/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useRef, useState } from 'react'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { useQueryClient } from '@tanstack/react-query'
import { usePlateStore } from '@udecode/plate-common/react'
import { Eye } from 'lucide-react'

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'

import { BASE_STATUS, EStatus } from '@/types/common'

const Versions = ({
	latestStatus,
	selectedStatus,
	setSelectedStatus,
}: {
	latestStatus: EStatus | typeof BASE_STATUS
	selectedStatus: EStatus | undefined
	setSelectedStatus: React.Dispatch<React.SetStateAction<EStatus | undefined>>
}) => {
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const setReadOnly = usePlateStore().set.readOnly()

	const queryClient = useQueryClient()

	const { saveEpisodeMutation } = useEpisodeHook()

	const latestIndex =
		latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0
	const selectedIndex = selectedStatus
		? statuses.indexOf(selectedStatus)
		: latestIndex

	const handleSelect = (value: EStatus) => {
		const currentIndex = statuses.indexOf(value)
		currentSelection.current = value
		if (currentIndex > latestIndex) {
			setIsDialogOpen(true)
		} else {
			setSelectedStatus(value)
		}
	}

	const handleConfirm = async () => {
		if (currentSelection.current) {
			await saveEpisodeMutation.mutateAsync({
				text: 'Status update',
				statusChange: currentSelection.current,
			})
			await queryClient.invalidateQueries({ queryKey: ['info'], type: 'all' })
			await queryClient.invalidateQueries({
				queryKey: ['content'],
				type: 'all',
			})
			await queryClient.invalidateQueries({
				queryKey: ['episodes'],
				type: 'all',
			})
		}
	}

	useEffect(() => {
		if (latestStatus && selectedStatus) {
			setReadOnly(selectedIndex < latestIndex)
		}
	}, [latestIndex, latestStatus, selectedIndex, selectedStatus, setReadOnly])

	if (saveEpisodeMutation.isPending) return <Spinner size={24} />

	return (
		<>
			<Select
				value={selectedStatus || statuses[latestIndex]}
				onValueChange={handleSelect}
			>
				<SelectTrigger className="gap-2">
					<SelectValue placeholder="Version" />
				</SelectTrigger>
				<SelectContent>
					{statuses.map((status, index) => (
						<SelectItem
							disabled={index > latestIndex + 1}
							key={index}
							value={status}
						>
							{status}
							{index < latestIndex && <Eye className="ml-2 inline" size={16} />}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Selection</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription>
						Are you sure you want to switch to {currentSelection.current}?
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default Versions
