/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import { CrossIcon } from '@/icons/cross-icon'
import { ImportStory } from '@/page-builders/stories/import-story'
import useStoryStore from '@/store/story-store'
import { useShallow } from 'zustand/react/shallow'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import { cn } from '@/lib/aural-ui/utils'

interface ICreateAndImportProps {
	children: React.ReactNode
}

const CreateAndImport = ({ children }: ICreateAndImportProps) => {
	const { isFormOpen, title, showTitle, setFormOpen, setTitle, setShowTitle } =
		useStoryStore(
			useShallow((state) => ({
				isFormOpen: state.isFormOpen,
				title: state.title,
				showTitle: state.showTitle,
				setFormOpen: state.setFormOpen,
				setTitle: state.setTitle,
				setShowTitle: state.setShowTitle,
			}))
		)

	const onOpenChange = (open: boolean) => {
		setFormOpen(open)
	}

	useEffect(() => {
		setTitle(CI_DIALOG_TITLE.DEFAULT)
		setShowTitle(true)
	}, [isFormOpen])

	return (
		<Dialog open={isFormOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				borderConfig={['left', 'right']}
				className="max-sm:[100vw] h-[85vh] w-[90vw] max-w-137.5 gap-5 px-0 [box-shadow:none]"
			>
				<DialogHeader className={cn('space-y-0 px-8', { hidden: !showTitle })}>
					<DialogTitle className="flex h-14 items-center justify-between gap-4">
						{title}
						<DialogClose
							className={iconButtonVariants({
								variant: 'ghost',
								size: 'small',
								shape: 'square',
							})}
						>
							<CrossIcon className="h-4 w-4" />
						</DialogClose>
					</DialogTitle>
					<DialogDescription className="sr-only">
						Create and Import story
					</DialogDescription>
					<Divider variant="dashed" />
				</DialogHeader>
				<ImportStory />
			</DialogContent>
		</Dialog>
	)
}

export default CreateAndImport
