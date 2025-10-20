'use client'

import * as React from 'react'
import { popupStore, TPopupOptions } from '@/store/popup-store'

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
import { If } from '@/components/if-else'
import { cn } from '@/lib/aural-ui/utils'

const textColorRecord: Record<NonNullable<TPopupOptions['type']>, string> = {
	info: 'text-fm-blue-300',
	negative: 'text-fm-red-300',
	neutral: 'text-fm-neutral-300',
	positive: 'text-fm-green-300',
	warning: 'text-fm-yellow-300',
}
export function PopupRoot() {
	const [popup, setPopup] = React.useState<TPopupOptions | null>(null)

	React.useEffect(() => {
		const unsubscribe = popupStore.subscribe(setPopup)
		return () => {
			unsubscribe()
		}
	}, [])

	const handleClose = React.useCallback(() => {
		popupStore.close()
	}, [])

	const handleConfirm = React.useCallback(() => {
		popup?.onConfirm?.()
		handleClose()
	}, [popup, handleClose])

	const handleCancel = React.useCallback(() => {
		popup?.onCancel?.()
		handleClose()
	}, [popup, handleClose])

	if (!popup) {
		return null
	}

	const Icon = popup.icon
	const {
		title,
		description,
		cancelText = 'Cancel',
		confirmText = 'Confirm',
		type = 'neutral',
	} = popup

	return (
		<Dialog defaultOpen onOpenChange={handleClose}>
			<DialogContent variant={type} noise="none" className="w-100">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-center pt-4">
						{Icon && <Icon className={cn('h-8 w-8', textColorRecord[type])} />}
					</DialogTitle>
					<DialogDescription className="text-fm-text py-4 text-center">
						<p className="text-xl">{title}</p>
						<If condition={!!description}>
							<p className="text-fm-tertiary mt-2">{description}</p>
						</If>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
					<DialogClose asChild>
						<Button variant="secondary" onClick={handleConfirm}>
							{confirmText}
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="outline" onClick={handleCancel}>
							{cancelText}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
