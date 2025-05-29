import React from 'react'
import { statuses, titleToStatus } from '@/constants/episodes-constants'
import useIsGerman from '@/hooks/use-is-german'
import useVersions from '@/hooks/use-versions'
import { Eye } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

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
import { useEpisodeContext } from '@/providers/episode-id-provider'

import { BASE_STATUS, EStatus } from '@/types/common'

const Versions = ({
	isChildEpisode,
	latestStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
}) => {
	const { useEpisodeIdStoreContext } = useEpisodeContext()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedStatus)
	)
	const {
		handleConfirm,
		handleSelect,
		isDialogOpen,
		latestIndex,
		setIsDialogOpen,
		currentSelection,
		statusUpdateMutation,
	} = useVersions({
		isChildEpisode,
		latestStatus,
	})

	const isGerman = useIsGerman()

	if (!isGerman) {
		return null
	}

	if (statusUpdateMutation.isPending) {
		return <Spinner size={24} />
	}

	return (
		<>
			<Select
				value={selectedStatus || statuses[latestIndex]}
				onValueChange={handleSelect}
			>
				<SelectTrigger className="gap-2">
					<SelectValue className="" placeholder="Version" />
				</SelectTrigger>
				<SelectContent>
					{statuses.map((status, index) => (
						<SelectItem
							disabled={index > latestIndex + Number(!isChildEpisode)}
							key={index}
							value={status}
						>
							{titleToStatus[status]}
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
						Are you sure you want to switch to{' '}
						{titleToStatus[currentSelection as EStatus] || currentSelection}?
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
