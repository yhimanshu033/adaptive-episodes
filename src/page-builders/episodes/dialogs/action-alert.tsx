/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { useEpisodeStore } from '@/store/episode-store'
import { Table } from '@tanstack/react-table'
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
import { If } from '@/components/aural-ui/if-else'

import { TEpisode } from '@/types/episode-type'

const ActionAlert = ({ table }: { table: Table<TEpisode> }) => {
	const { useEpisodeTableStore, setIsDialogOpen } = useEpisodeStore()
	const { isDialogOpen } = useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))
	const { handleConfirm } = useEpisodeTable()

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent
				variant={alertInfo?.variant ?? 'neutral'}
				classes={{
					root: 'flex h-88 w-99 flex-col items-center px-6 py-8 text-center',
					overlay: 'z-60',
					content: 'z-70',
				}}
				noise="none"
				opacity="high"
				glass="high"
			>
				<DialogHeader>
					<div className="flex items-center justify-center pt-4">
						{alertInfo?.icon}
					</div>

					<DialogTitle className="mt-4 text-center text-xl">
						{alertInfo?.description}
					</DialogTitle>
					<DialogDescription className="text-fm-tertiary mt-2 mb-6 text-center">
						{alertInfo?.subDescription}
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
								table.resetRowSelection()
							}}
						>
							{alertInfo?.action}
						</Button>
					)}

					<If condition={!!alertInfo?.secondAction}>
						<Button
							variant="outline"
							className="w-full capitalize"
							onClick={() => setIsDialogOpen(false)}
						>
							{alertInfo?.secondAction}
						</Button>
					</If>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ActionAlert
