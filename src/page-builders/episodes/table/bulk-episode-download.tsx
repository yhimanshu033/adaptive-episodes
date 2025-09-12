import React, { useCallback } from 'react'
import useBulkEpisodeMutations from '@/hooks/mutation/use-bulk-episode-mutations'
import { DownloadCloud } from 'lucide-react'

import {
	buttonVariants,
	innerButtonVariants,
} from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/aural-ui/hover-card'
import { IfElse } from '@/components/aural-ui/if-else'
import { List, ListItem, ListSeparator } from '@/components/aural-ui/list'
import { cn } from '@/lib/aural-ui/utils'

import { TEpisode } from '@/types/episode-type'

interface BulkEpisodeDownloadProps {
	selectedRowData: TEpisode[]
}
export default function BulkEpisodeDownload({
	selectedRowData,
}: BulkEpisodeDownloadProps) {
	const {
		downloadBulkMutation: { mutate, isPending },
	} = useBulkEpisodeMutations()

	const handleDownload = useCallback(
		(separate: boolean) => {
			if (isPending) {
				return
			}

			mutate({
				selectedEpisodes: selectedRowData.map((item) => ({
					chapter_title: item.chapter_title,
					seq_number: item.seq_number,
				})),
				separate,
			})
		},
		[mutate, selectedRowData, isPending]
	)

	return (
		<HoverCard openDelay={100} closeDelay={100}>
			<HoverCardTrigger asChild>
				<div
					className={cn(
						buttonVariants({ variant: 'outline' }),
						innerButtonVariants({ variant: 'outline' }),
						'border-fm-divider-secondary h-9'
					)}
				>
					<IfElse
						condition={isPending}
						if={<CircularLoader className="size-4" />}
						else={<DownloadCloud size={16} />}
					/>
				</div>
			</HoverCardTrigger>

			<HoverCardContent
				className="rounded-fm-s! w-48 p-0 transition-all"
				align="start"
			>
				<List showBorder={false} className="w-full bg-transparent p-0">
					<ListItem
						size="sm"
						onClick={() => handleDownload(false)}
						disabled={isPending}
						className="flex justify-start gap-2 px-3 py-2"
					>
						<DownloadCloud size={14} />
						Single merged file
					</ListItem>
					<ListSeparator />
					<ListItem
						size="sm"
						onClick={() => handleDownload(true)}
						disabled={isPending}
						className="flex justify-start gap-2 px-3 py-2"
					>
						<DownloadCloud size={14} />
						Separate files
					</ListItem>
				</List>
			</HoverCardContent>
		</HoverCard>
	)
}
