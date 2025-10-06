/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useMemo } from 'react'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaveEpisode from '@/hooks/use-save-episode'
import { CircleCheck, CloudAlert } from 'lucide-react'
import { useEventCallback } from 'usehooks-ts'

import { Button } from '@/components/aural-ui/button'
import IfElse, { Else, If } from '@/components/if-else'
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
		<Button
			id={`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`}
			innerClassName="!px-0 !py-0 !translate-y-0 !text-fm-placeholder !text-fm-sm"
			variant="text"
			className="!text-fm-placeholder text-fm-sm flex items-center gap-2"
			onClick={() => void handleSave()}
		>
			<IfElse condition={isPending}>
				<If>
					<p className="font-fm-brand uppercase">Saving...</p>
				</If>
				<Else>
					<IfElse condition={!isSaved}>
						<If>
							<CloudAlert className="size-4" />
						</If>
						<Else>
							<CircleCheck className="size-4" />
						</Else>
					</IfElse>
					<p className="font-fm-brand whitespace-nowrap uppercase">
						Updated {updatedAt}
					</p>
				</Else>
			</IfElse>
		</Button>
	)
}

export default SaveEpisode
