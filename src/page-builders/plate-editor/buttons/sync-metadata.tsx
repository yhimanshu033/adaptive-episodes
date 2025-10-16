import React, { useCallback } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import useMetadataSyncMutation from '@/hooks/mutation/use-metadata-sync'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'

const SyncMetaData = () => {
	const { data } = useEpisodeContent()
	const metadataSyncMutation = useMetadataSyncMutation(Number(data?.chapter.id))

	const handleSync = useCallback(() => {
		if (!data?.chapter.id) {
			return toast.error('Error in Metadata Sync!')
		}
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.SYNC_METADATA,
			},
		})
		metadataSyncMutation.mutate()
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
