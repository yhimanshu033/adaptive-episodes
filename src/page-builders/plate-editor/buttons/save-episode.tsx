/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useMemo } from 'react'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaveEpisode from '@/hooks/use-save-episode'
import { Save } from 'lucide-react'
import { useEventCallback } from 'usehooks-ts'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import useEpisodeId from '@/providers/episode-id-provider'
import { formatRelativeTime } from '@/lib/utils/helpers'

const SaveEpisode = () => {
	const { handleSave, isSaved, readOnly, isPending, lastSaved } =
		useSaveEpisode()
	const episodeId = useEpisodeId()
	const { data: episodeContent } = useEpisodeContent()

	const updatedAt = useMemo(() => {
		const updateTime = lastSaved || episodeContent?.chapter.update_time
		if (!updateTime) {
			return null
		}
		const date = new Date(updateTime)
		return formatRelativeTime(date)
	}, [episodeContent, lastSaved])

	const handleKeyDown = useEventCallback(async (event: KeyboardEvent) => {
		if ((event.metaKey || event.ctrlKey) && event.key === 's') {
			event.preventDefault()
			if (isSaved) {
				return
			}
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

	if (readOnly) {
		return null
	}

	return (
		<div className="flex gap-2 text-sm text-muted-foreground">
			<IfElse condition={isPending}>
				<If>
					<p className="font-display uppercase">Saving...</p>
				</If>
				<Else>
					<p className="whitespace-nowrap font-display uppercase">
						Updated {updatedAt}
					</p>
					<Button
						id={`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`}
						tooltip="Save Episode"
						disabled={isSaved}
						className="size-0 overflow-hidden"
						size="icon"
						onClick={() => handleSave()}
					>
						<Save size={16} />
					</Button>
				</Else>
			</IfElse>
		</div>
	)
}

export default SaveEpisode
