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
					root: 'flex max-h-88 w-99 flex-col items-center px-6 py-8 text-center',
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

					<DialogTitle asChild>
						<Typography
							align="center"
							className="mt-4"
							as="h2"
							variant="body-large"
						>
							{alertInfo?.description}
						</Typography>
					</DialogTitle>
					<DialogDescription asChild>
						<Typography align="center" className="text-fm-tertiary mb-6">
							{alertInfo?.subDescription}
						</Typography>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
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
							variant="outline"
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
