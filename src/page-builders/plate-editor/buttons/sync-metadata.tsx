import React from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import useEpisodeId from '@/providers/episode-id-provider'
import { cn } from '@/lib/utils/helpers'

const SyncMetaData = () => {
	const episodeId = useEpisodeId()
	const { metadataSyncMutation } = useEpisodeHook()

	const handleSync = () => {
		metadataSyncMutation.mutate(Number(episodeId))
	}

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
