import React from 'react'
import { ArrowBoxLeftIcon } from '@/icons/arrow-box-left-icon'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Typography } from '@/components/aural-ui/typography'
import useAdaptation from '@/providers/adaptation-provider'

const ExitAdaptationDialog = () => {
	const {
		openExitDialog: open,
		setOpenExitDialog,
		setOpen,
		handleDiscardAdaptationTask,
	} = useAdaptation()

	const handleDialogChange = () => {
		setOpen(true)
		setOpenExitDialog(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleDialogChange}>
			<DialogContent
				variant="negative"
				glass="high"
				classes={{
					root: 'flex min-h-88 min-w-99 flex-col items-center px-6 py-8 text-center',
					overlay: 'z-60',
					content: 'z-70',
				}}
				className="bg-fm-secondary/15"
				noise="none"
			>
				<DialogHeader>
					<DialogTitle className="sr-only">Exit Adaptation</DialogTitle>
					<DialogDescription className="sr-only">
						If you exit, progress will be lost
					</DialogDescription>
				</DialogHeader>
				<div className="flex h-full flex-col items-center gap-8">
					<ArrowBoxLeftIcon className="text-fm-negative size-10" />
					<div className="space-y-2 text-center">
						<Typography variant="body-large" align="center">
							If you exit, progress will be lost
						</Typography>
						<Typography color="tertiary" align="center">
							{' '}
							You&apos;ll need to upload the file again and start the adaptation
							from the beginning
						</Typography>
					</div>
					<div className="flex w-full flex-col gap-5">
						<Button
							variant="secondary"
							className="w-full"
							innerClassName="h-11"
							onClick={() => {
								handleDiscardAdaptationTask()
							}}
						>
							Exit
						</Button>
						<Button
							variant="outline"
							className="w-full"
							innerClassName="h-11"
							onClick={() => setOpenExitDialog(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ExitAdaptationDialog
