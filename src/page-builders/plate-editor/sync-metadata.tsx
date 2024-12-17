import React from 'react'
import { useParams } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SyncMetaData = () => {
	const { episodeId } = useParams()
	const { metadataSyncMutation } = useEpisodeHook()

	const handleSync = () => {
		metadataSyncMutation.mutate(Number(episodeId))
	}

	return (
		<Button variant="outline" className="gap-2" onClick={handleSync}>
			AI Sync
			<RefreshCw
				size={16}
				className={cn({ 'animate-spin': metadataSyncMutation.isPending })}
			/>
		</Button>
	)
}

export default SyncMetaData
