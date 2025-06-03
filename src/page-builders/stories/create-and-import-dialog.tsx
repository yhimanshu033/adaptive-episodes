import React from 'react'
import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import { ImportStory } from '@/page-builders/stories/import-story'
import useStoryStore from '@/store/story-store'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { cn } from '@/lib/aural-ui/utils'

interface ICreateAndImportDialogProps {
	children: React.ReactNode
}

const CreateAndImportDialog = ({ children }: ICreateAndImportDialogProps) => {
	const { isFormOpen, title, showTitle, setFormOpen, setTitle, setShowTitle } =
		useStoryStore()

	const onOpenChange = (open: boolean) => {
		setFormOpen(open)

		if (!open) {
			setTitle(CI_DIALOG_TITLE.DEFAULT)
			setShowTitle(true)
		}
	}

	return (
		<Dialog open={isFormOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="h-181 w-138 gap-5 px-8 py-8" noise="none">
				<DialogHeader className={cn('space-y-8', { hidden: !showTitle })}>
					<DialogTitle>{title}</DialogTitle>
					<Divider variant="dashed" />
				</DialogHeader>
				<ImportStory />
			</DialogContent>
		</Dialog>
	)
}

export default CreateAndImportDialog
