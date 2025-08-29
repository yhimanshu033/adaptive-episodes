import React from 'react'
import { DialogProps } from '@radix-ui/react-dialog'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'

export default function CommonApplyChangesAlert({
	onConfirm,
	title = 'Apply Changes',
	description = `If you confirm, only the changes you've reviewed and handled
				will be applied to your episode. Any unreviewed suggestions will
				be skipped.`,
	cancelText = 'Cancel',
	confirmText = 'Confirm',
	props,
}: {
	cancelText?: string
	confirmText?: string
	description?: string
	onConfirm?: () => void
	props: DialogProps
	title?: string
}) {
	return (
		<Dialog {...props}>
			<DialogContent variant="negative" noise="none" className="w-100">
				<DialogHeader>
					<DialogTitle className="pt-4 text-center">{title}</DialogTitle>
					<DialogDescription className="text-fm-text py-4 text-center">
						<p className="text-fm-tertiary mt-2">{description}</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
					<DialogClose asChild>
						<Button variant="secondary" onClick={onConfirm}>
							{confirmText}
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="outline">{cancelText}</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
