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
import { Typography } from '@/components/aural-ui/typography'

import { TEpisode } from '@/types/episode-type'

const ActionAlert = ({ table }: { table: Table<TEpisode> }) => {
	const { useEpisodeTableStore, setIsDialogOpen } = useEpisodeStore()
	const { isDialogOpen } = useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))
	const { handleConfirm } = useEpisodeTable()

	const capitalizeFirstLetter = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent
				variant={alertInfo?.variant ?? 'neutral'}
				classes={{
					root: 'flex max-h-88 w-99 flex-col items-center gap-8 px-6 py-8 text-center bg-fm-surface-frosted/25',
					overlay: 'z-60',
					content: 'z-70',
				}}
				noise="none"
				opacity="high"
				glass="high"
			>
				<DialogHeader className="space-y-8">
					<div className="flex items-center justify-center">
						{alertInfo?.icon}
					</div>
					<div className="flex flex-col items-center justify-center gap-2">
						<DialogTitle>
							<Typography align="center" as="h2" variant="body-large">
								{alertInfo?.description}
							</Typography>
						</DialogTitle>
						<DialogDescription className="px-4">
							<Typography align="center" color="tertiary">
								{alertInfo?.subDescription}
							</Typography>
						</DialogDescription>
					</div>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-5">
					{alertInfo?.action && (
						<Button
							variant="secondary"
							className="w-full"
							onClick={() => {
								void handleConfirm()
								setIsDialogOpen(false)
								table.resetRowSelection()
							}}
						>
							{alertInfo?.action && capitalizeFirstLetter(alertInfo.action)}
						</Button>
					)}

					<If condition={!!alertInfo?.secondAction}>
						<Button
							variant={
								alertInfo?.secondAction === 'Got it' ? 'secondary' : 'outline'
							}
							className="w-full"
							onClick={() => setIsDialogOpen(false)}
						>
							{alertInfo?.secondAction &&
								capitalizeFirstLetter(alertInfo.secondAction)}
						</Button>
					</If>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ActionAlert
