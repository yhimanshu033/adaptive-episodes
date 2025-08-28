import React, { useMemo } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { cn } from '@/lib/utils/helpers'

const SyncMetaData = () => {
	const { data } = useEpisodeContent()
	const { metadataSyncMutation } = useEpisodeHook()

	const episodeId = useMemo(() => {
		return data?.chapter.id
	}, [data])

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
