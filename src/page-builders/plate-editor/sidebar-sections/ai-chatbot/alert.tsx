import React from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import { TrashIcon } from '@/icons/trash-icon'

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

export default function ChatClearAlert({
	children,
	onTrigger,
}: {
	children?: React.ReactNode
	onTrigger?: () => void
}) {
	const { clearMessages, cancelRequest } = useAIChatbot()
	function handleDelete() {
		clearMessages()
		cancelRequest()
	}

	function handleOpenChange(open: boolean) {
		if (!open && onTrigger) {
			onTrigger()
		}
	}

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent variant="negative" noise="none" className="w-100">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-center pt-4">
						<TrashIcon className="text-fm-negative h-8 w-8" />
					</DialogTitle>
					<DialogDescription className="text-fm-text py-4 text-center">
						<p className="text-xl"> Delete chat history permanently</p>
						<p className="text-fm-tertiary mt-2">
							Once deleted, this can&apos;t be undone
						</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full !flex-col gap-4">
					<DialogClose asChild>
						<Button variant="secondary" onClick={handleDelete}>
							Delete
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
