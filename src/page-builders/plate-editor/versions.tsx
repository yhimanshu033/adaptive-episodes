import React from 'react'
import { statuses } from '@/constants/episodes-constants'
import useVersions from '@/hooks/use-versions'
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
	isChildEpisode,
	latestStatus,
	selectedStatus,
	setSelectedStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
	selectedStatus: EStatus | undefined
	setSelectedStatus: React.Dispatch<React.SetStateAction<EStatus | undefined>>
}) => {
	const {
		handleConfirm,
		handleSelect,
		isDialogOpen,
		saveEpisodeMutation,
		latestIndex,
		setIsDialogOpen,
		currentSelection,
	} = useVersions({
		isChildEpisode,
		latestStatus,
		selectedStatus,
		setSelectedStatus,
	})

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
							disabled={index > latestIndex + Number(!isChildEpisode)}
							key={index}
							value={status}
						>
							{status}
							{index < latestIndex + Number(isChildEpisode) && (
								<Eye className="ml-2 inline" size={16} />
							)}
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
						Are you sure you want to switch to {currentSelection}?
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => void handleConfirm()}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default Versions
