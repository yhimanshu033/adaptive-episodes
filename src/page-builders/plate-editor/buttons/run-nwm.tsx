import React, { useCallback } from 'react'
import { NWM_EMAIL } from '@/constants/global-constants'
import { useEpisodeRegenerate } from '@/hooks/mutation/use-episode-regenerate'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { RefreshCw } from 'lucide-react'
import { useEditorReadOnly } from 'platejs/react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { cn, hasNWMRan } from '@/lib/utils/helpers'

const RunNWMButton = () => {
	const { data } = useEpisodeContent()
	const { mutateAsync, isPending } = useEpisodeRegenerate()

	const readOnly = useEditorReadOnly()

	const { setRecentEmail } = useEpisodeIdStore()

	const handleRunNWM = useCallback(async () => {
		if (!data?.chapter.id) {
			return toast.error('Error in NWM Regeneration!')
		}

		await mutateAsync({ episodeId: data.chapter.id })
		setRecentEmail(NWM_EMAIL)
	}, [data, mutateAsync, setRecentEmail])

	if (readOnly) {
		return null
	}

	return (
		<Button
			tooltip="Click here to regenerate the episode with NWM!"
			variant="secondary"
			className="w-full gap-2"
			innerClassName="rounded-none"
			disabled={isPending || hasNWMRan(data?.chapter)}
			isDisabled={isPending || hasNWMRan(data?.chapter)}
			onClick={() => void handleRunNWM()}
		>
			Run NWM
			<RefreshCw size={16} className={cn({ 'animate-spin': isPending })} />
		</Button>
	)
}

export default RunNWMButton
