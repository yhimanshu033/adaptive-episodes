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
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
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
				variant="neutral"
				classes={{
					content: 'w-full',
					root: 'px-0',
				}}
				noise="none"
				showCloseButton={false}
			>
				<ScrollArea className="px-4 [&>[data-radix-scroll-area-viewport]]:max-h-[90vh]">
					<DialogHeader>
						<DialogTitle className="pt-2">
							<div className="flex items-center justify-between py-3">
								<h3 className="font-fm-text text-xl">Share access</h3>
								<IconButton
									variant="ghost"
									size="small"
									onClick={() => setIsShareAccessDialogOpen(false)}
									icon={<CrossIcon width={20} height={20} />}
									label="cross icon"
								/>
							</div>
						</DialogTitle>
						<div>
							<Divider variant="dashed" />
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
					</DialogHeader>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
