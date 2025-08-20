import React from 'react'
import useBulkEpisodeMutations from '@/hooks/mutation/use-bulk-episode-mutations'
import { DownloadCloud } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IfElse } from '@/components/aural-ui/if-else'
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
	function handleClick() {
		const seq_nos = selectedRowData.map((item) => item.seq_number)
		mutate({
			seq_nos,
		})
	}
	return (
		<Button
			variant="outline"
			disabled={selectedRowData.length < 1 || isPending}
			isDisabled={selectedRowData.length < 1 || isPending}
			tooltip="Bulk Episode Download"
			innerClassName={cn('border-fm-divider-secondary h-9', {
				'border-fm-divider-tertiary !text-fm-icon-inactive':
					selectedRowData.length < 1,
			})}
			onClick={handleClick}
		>
			<IfElse
				condition={isPending}
				if={<CircularLoader className="size-4" />}
				else={<DownloadCloud size={16} />}
			/>
		</Button>
	)
}
