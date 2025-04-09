/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect } from 'react'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import useSaveEpisode from '@/hooks/use-save-episode'
import { Save } from 'lucide-react'
import { useEventCallback } from 'usehooks-ts'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import useEpisodeId from '@/providers/episode-id-provider'

const SaveEpisode = () => {
	const { handleSave, isSaved, readOnly, isPending } = useSaveEpisode()
	const episodeId = useEpisodeId()

	const handleKeyDown = useEventCallback(async (event: KeyboardEvent) => {
		if ((event.metaKey || event.ctrlKey) && event.key === 's') {
			event.preventDefault()
			if (isSaved) return
			await handleSave()
		}
	})

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (readOnly) return null

	return (
		<div className="flex gap-2">
			{isPending ? (
				<IconLoader />
			) : (
				<Button
					id={`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`}
					tooltip="Save Episode"
					disabled={isSaved}
					size="icon"
					onClick={() => handleSave()}
				>
					<Save size={16} />
				</Button>
			)}
		</div>
	)
}

export default SaveEpisode
