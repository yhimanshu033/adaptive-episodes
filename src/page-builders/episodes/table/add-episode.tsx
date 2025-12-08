import React from 'react'
import useIsUGC from '@/hooks/ugc/use-is-ugc'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { ImportLeftArrowFolderIcon } from '@/icons/import-left-folder-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { useEpisodeStore } from '@/store/episode-store'

import { Button } from '@/components/aural-ui/button'
import { useDialogCleanup } from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

const AddEpisode = ({ episodeCount }: { episodeCount?: number }) => {
	const { setIsInventOpen, setInventSeq } = useEpisodeStore()
	const { handleDialogClose } = useDialogCleanup({ threshold: 100 })

	const { setBseDialogOpen } = useEpisodeStore()
	const isUGC = useIsUGC()

	if (isUGC) {
		return null
	}

	return (
		<DropdownMenu onOpenChange={handleDialogClose}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="primary"
					className="font-fm-brand h-11 text-sm"
					leftIcon={<PlusIcon width={20} height={20} />}
					rightIcon={<ChevronDownIcon width={20} height={20} />}
				>
					Add
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => {
						setIsInventOpen(true)
						setInventSeq((episodeCount ?? 0) + 1)
					}}
				>
					<PlusIcon />
					<span>Add new episode</span>
				</DropdownMenuItem>
				<div className="px-3">
					<Divider variant="dashed" />
				</div>
				<DropdownMenuItem onClick={() => setBseDialogOpen(true)}>
					<ImportLeftArrowFolderIcon />
					<span>Import new episode</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default AddEpisode
