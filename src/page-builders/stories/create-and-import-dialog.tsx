import React from 'react'
import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import { ImportStory } from '@/page-builders/stories/import-story'
import useStoryStore from '@/store/story-store'

// import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'
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
			<DialogContent className="h-181 w-138 px-8 py-0" glass={false}>
				<DialogHeader
					className={cn(
						'border-fm-divider-primary/50 border-b border-dashed py-8',
						{ hidden: !showTitle }
					)}
				>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ImportStory />
			</DialogContent>
		</Dialog>
	)
}

export default CreateAndImportDialog
