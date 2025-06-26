import React from 'react'
import { CrossIcon } from '@/icons/cross-icon'
import SearchMembers from '@/page-builders/episodes/shared-access-dialog/search-members'
import SharedList from '@/page-builders/episodes/shared-access-dialog/shared-list'
import UpdateDriveFolder from '@/page-builders/manage-project/update-gdrive-folder'
import UpdateLOCSheet from '@/page-builders/manage-project/update-loc-sheet'
import UpdateSlackChannel from '@/page-builders/manage-project/update-slack-channel'
import { useEpisodeStore } from '@/store/episode-store'

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

import { EFolderType } from '@/types/admin-types'

export default function ShareAccessDialog() {
	const { useEpisodeTableStore, setIsShareAccessDialogOpen } = useEpisodeStore()
	const { isSharedAccessDialogOpen } = useEpisodeTableStore()

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
				className="w-[90vw] gap-5 px-0"
			>
				<ScrollArea className="px-4 [&>[data-radix-scroll-area-viewport]]:max-h-[90vh]">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between gap-4">
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

						<Divider variant="dashed" />
					</DialogHeader>
					<div>
						<SearchMembers />
						<h3 className="font-fm-brand mb-4 text-sm tracking-wider uppercase">
							Shared with
						</h3>
						<Divider variant="dashed" />
						<SharedList />
						<h3 className="font-fm-brand my-5 text-sm tracking-wider uppercase">
							Other Links
						</h3>
						<Divider variant="dashed" />
						<UpdateLOCSheet />
						<UpdateDriveFolder folderType={EFolderType.CMS} />
						<UpdateSlackChannel />
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
