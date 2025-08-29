import React, { useCallback } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { cn } from '@/lib/utils/helpers'

const SyncMetaData = () => {
	const { data } = useEpisodeContent()
	const { metadataSyncMutation } = useEpisodeHook()

	const handleSync = useCallback(() => {
		if (!data?.chapter.id) {
			return toast.error('Error in Metadata Sync!')
		}
		metadataSyncMutation.mutate(Number(data?.chapter.id))
	}, [data, metadataSyncMutation])

	return (
		<Button
			tooltip="Click here to update story details with the AI so it can better assist you"
			variant="secondary"
			className="w-full gap-2"
			innerClassName="rounded-none"
			disabled={metadataSyncMutation.isPending}
			isDisabled={metadataSyncMutation.isPending}
			onClick={handleSync}
		>
			AI Sync
			<RefreshCw
				size={16}
				className={cn({ 'animate-spin': metadataSyncMutation.isPending })}
			/>
		</Button>
	)
}

export default SyncMetaData
