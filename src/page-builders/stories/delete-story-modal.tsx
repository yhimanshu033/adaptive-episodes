import React from 'react'
import { TrashIcon } from '@/icons/trash-icon'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	useDialogCleanup,
} from '@/components/aural-ui/dialog'
import { Typography } from '@/components/aural-ui/typography'

interface DeleteStoryModalProps {
	onOpenChange: (open: boolean) => void
	open: boolean
	storyTitle?: string
}

const DeleteStoryModal = ({
	open,
	onOpenChange,
	storyTitle = '',
}: DeleteStoryModalProps) => {
	const { handleDialogClose } = useDialogCleanup({
		threshold: 1000,
	})

	const onDialogChange = (val: boolean) => {
		onOpenChange(val)

		if (!val) {
			handleDialogClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={onDialogChange}>
			<DialogContent
				variant="negative"
				classes={{
					root: 'flex h-88 w-99 flex-col items-center px-6 py-8 text-center',
					overlay: 'z-60',
					content: 'z-70',
				}}
				noise="none"
				opacity="high"
				glass="high"
			>
				<div className="flex flex-col items-center gap-8">
					<TrashIcon height={44} width={44} className="text-fm-negative" />
					<div className="space-y-2">
						<DialogTitle asChild>
							<Typography align="center" as="h2" variant="body-large">
								{`Delete ${storyTitle}`}
							</Typography>
						</DialogTitle>
						<DialogDescription asChild>
							<Typography align="center" className="text-fm-tertiary">
								Once deleted, this can&apos;t be undone. Don&apos;t worry! You
								can always create a new story.
							</Typography>
						</DialogDescription>
					</div>
					<div className="flex w-full flex-col gap-5">
						<Button
							variant="secondary"
							onClick={() => {
								console.log('Delete')
								onDialogChange(false)
							}}
						>
							Delete
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								onDialogChange(false)
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteStoryModal
