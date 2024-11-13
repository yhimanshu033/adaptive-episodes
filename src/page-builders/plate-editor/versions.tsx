import React, { useEffect, useRef, useState } from 'react'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { usePlateStore } from '@udecode/plate-common/react'
import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { EStatus } from '@/types/common'

const Versions = ({
	latestStatus,
	selectedStatus,
	setSelectedStatus,
}: {
	latestStatus: EStatus | undefined
	selectedStatus: EStatus | undefined
	setSelectedStatus: React.Dispatch<React.SetStateAction<EStatus | undefined>>
}) => {
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const setReadOnly = usePlateStore().set.readOnly()

	const { saveEpisodeMutation } = useEpisodeHook()

	const latestIndex = latestStatus ? statuses.indexOf(latestStatus) : 0
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

	const handleConfirm = () => {
		setIsDialogOpen(false)
		if (currentSelection.current) {
			saveEpisodeMutation.mutate(
				{
					text: 'Status update',
					statusChange: currentSelection.current,
				},
				{
					onSuccess: () => {
						setSelectedStatus(currentSelection.current)
					},
				}
			)
		}
	}

	const handleCancel = () => {
		setIsDialogOpen(false)
	}

	useEffect(() => {
		if (latestStatus && selectedStatus) {
			setReadOnly(selectedIndex < latestIndex)
		}
	}, [latestIndex, latestStatus, selectedIndex, selectedStatus, setReadOnly])

	return (
		<>
			<Select
				value={selectedStatus || latestStatus}
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

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogTitle>Confirm Selection</DialogTitle>
					<p>Are you sure you want to switch to {currentSelection.current}?</p>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleConfirm}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Versions
