/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import useSaveEpisode from '@/hooks/use-save-episode'
import { Save } from 'lucide-react'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import useEpisodeId from '@/providers/episode-id-provider'

const SaveEpisode = () => {
	const { handleSave, isSaved, readOnly, isPending } = useSaveEpisode()
	const episodeId = useEpisodeId()

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
