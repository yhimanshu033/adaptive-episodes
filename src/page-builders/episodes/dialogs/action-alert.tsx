/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'

const ActionAlert = () => {
	const { useEpisodeTableStore, setIsDialogOpen } = useEpisodeStore()
	const { isDialogOpen } = useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))
	const { handleConfirm } = useEpisodeTable()

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent
				// @ts-expect-error type
				variant={alertInfo?.variant ?? 'neutral'}
				classes={{
					root: 'w-80',
				}}
				noise="none"
			>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-center pt-4">
						{alertInfo?.icon}
					</DialogTitle>
					<DialogDescription className="text-fm-text py-4 text-center">
						<h3 className="text-xl">{alertInfo?.description}</h3>
						<h4 className="text-fm-tertiary mt-4">
							{alertInfo?.subDescription}
						</h4>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
					{alertInfo?.action && (
						<Button
							variant="secondary"
							className="w-full capitalize"
							onClick={() => {
								void handleConfirm()
								setIsDialogOpen(false)
							}}
						>
							{alertInfo?.action}
						</Button>
					)}

					<Button variant="outline" className="w-full capitalize">
						{alertInfo?.secondAction}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ActionAlert
