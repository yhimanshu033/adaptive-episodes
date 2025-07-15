import React from 'react'
import { CrossIcon } from '@/icons/cross-icon'
import SearchMembers from '@/page-builders/episodes/shared-access-dialog/search-members'
import SharedList from '@/page-builders/episodes/shared-access-dialog/shared-list'
import UpdateDriveFolder from '@/page-builders/manage-project/update-gdrive-folder'
import UpdateLOCSheet from '@/page-builders/manage-project/update-loc-sheet'
import UpdateSlackChannel from '@/page-builders/manage-project/update-slack-channel'
import { useEpisodeStore } from '@/store/episode-store'
import { useShallow } from 'zustand/react/shallow'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

import { EFolderType } from '@/types/admin-types'

export default function ShareAccessDialog() {
	const { useEpisodeTableStore, setIsShareAccessDialogOpen } = useEpisodeStore()
	const { showSharedList, isSharedAccessDialogOpen } = useEpisodeTableStore(
		useShallow((state) => ({
			showSharedList: state.showSharedList,
			isSharedAccessDialogOpen: state.isSharedAccessDialogOpen,
		}))
	)

	return (
		<Dialog
			open={isSharedAccessDialogOpen}
			onOpenChange={setIsShareAccessDialogOpen}
		>
			<DialogContent
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				className="h-[90vh] w-[90vh] max-w-137.5 gap-5 px-0"
			>
				<ScrollArea className="h-full">
					<DialogHeader className="space-y-0 px-8">
						<DialogTitle className="mb-0 flex h-14 items-center justify-between gap-4">
							Share access
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
							New Episode
						</DialogDescription>

						<Divider variant="dashed" className="border-fm-divider-secondary" />
					</DialogHeader>
					<div>
						<SearchMembers />
						<div
							className={cn('transition-opacity duration-200', {
								'opacity-0': !showSharedList,
							})}
						>
							<div className="px-8">
								<Typography
									transform="uppercase"
									variant="caption-medium"
									className="font-fm-brand mb-4"
								>
									Shared with
								</Typography>
								<Divider
									variant="dashed"
									className="border-fm-divider-secondary"
								/>
							</div>
							<SharedList />
						</div>
						<div className="mt-10 px-8">
							<Typography
								transform="uppercase"
								variant="caption-medium"
								className="font-fm-brand mb-4"
							>
								Other Links
							</Typography>
							<Divider
								variant="dashed"
								className="border-fm-divider-secondary"
							/>
						</div>
						<div className="flex flex-col gap-6 px-8 pt-6">
							<UpdateLOCSheet />
							<UpdateDriveFolder folderType={EFolderType.CMS} />
							<UpdateSlackChannel />
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
