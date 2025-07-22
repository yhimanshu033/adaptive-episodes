import React from 'react'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'

export default function SFXAlert({
	children,
	onConfirm,
}: {
	children?: React.ReactNode
	onConfirm?: () => void
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent variant="negative" noise="none" className="w-100">
				<DialogHeader>
					<DialogTitle className="pt-4 text-center">Apply Changes</DialogTitle>
					<DialogDescription className="text-fm-text py-4 text-center">
						<p className="text-fm-tertiary mt-2">
							If you confirm, only the changes you&apos;ve reviewed and handled
							will be applied to your episode. Any unreviewed suggestions will
							be skipped.
						</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
					<DialogClose asChild>
						<Button variant="secondary" onClick={onConfirm}>
							Confirm
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
