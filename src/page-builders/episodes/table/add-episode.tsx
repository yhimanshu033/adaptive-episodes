import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { ImportLeftArrowFolderIcon } from '@/icons/import-left-folder-icon'
import { MaintenanceIcon } from '@/icons/maintenance-icon'
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
	const { setIsInventOpen, setInventIndex } = useEpisodeStore()
	const { handleEpisodeInfo } = useEpisodeTable()
	const { handleDialogClose } = useDialogCleanup({ threshold: 100 })

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
						setInventIndex((episodeCount ?? 0) - 1)
					}}
				>
					<PlusIcon />
					<span>Add new episode</span>
				</DropdownMenuItem>
				<div className="px-3">
					<Divider variant="dashed" />
				</div>
				<DropdownMenuItem
					onClick={() =>
						handleEpisodeInfo({
							icon: (
								<MaintenanceIcon
									className="text-fm-icon-info"
									width={44}
									height={44}
								/>
							),
							description:
								'We are currently working on bringing you the ability to import episodes. This feature will be available soon to enhance your storytelling experience.',
							title: 'Feature Coming Soon',
						})
					}
				>
					<ImportLeftArrowFolderIcon />
					<span>Import new episode</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default AddEpisode
