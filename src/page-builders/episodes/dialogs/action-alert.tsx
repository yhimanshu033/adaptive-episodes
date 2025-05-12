/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { useEpisodeStore } from '@/store/episode-store'
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

const ActionAlert = () => {
	const { useEpisodeTableStore, setIsDialogOpen } = useEpisodeStore()
	const { isDialogOpen } = useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))
	const { handleConfirm } = useEpisodeTable()
	return (
		<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Selection</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					{alertInfo?.description}
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					{alertInfo?.action && (
						<AlertDialogAction onClick={handleConfirm}>
							Confirm
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ActionAlert
