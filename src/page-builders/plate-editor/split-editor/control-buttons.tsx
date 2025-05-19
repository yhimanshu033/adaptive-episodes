import React, { useMemo } from 'react'
import useEditorExtendedStore from '@/store/extended-store'

import { Separator } from '@/components/ui/separator'
import useEpisodeId from '@/providers/episode-id-provider'

import EpisodeButton from '../buttons/episode-button'

export default function ControlButtons() {
	const {
		store: extendStore,
		// updateExtended
	} = useEditorExtendedStore()
	const { extended, episodeMap } = extendStore()
	const episodeId = useEpisodeId()

	const firstEpisode = episodeMap[extended[0]]
	const lastEpisode = episodeMap[extended[extended.length - 1]]
	// const { data: content } = useEpisodeContent()

	const isLast = useMemo(
		() => episodeId === extended[extended.length - 1],
		[episodeId, extended]
	)

	if (!isLast) {
		return <Separator className="mt-8" />
	}

	return (
		<div className="mt-5 flex animate-fade-in-up items-center justify-between gap-2">
			<EpisodeButton
				direction="previous"
				episodeId={firstEpisode?.previous_parent_id}
			/>
			{/* UNCOMMENT IF WE ENABLE EPISODE EXTENSION AGAIN */}
			{/* <SplitButton
				tooltip="Next Episode Extension"
				disabled={!content?.next_parent_id}
				onClick={() => updateExtended(Number(content?.next_parent_id), 'next')}
			/> */}
			<EpisodeButton direction="next" episodeId={lastEpisode?.next_parent_id} />
		</div>
	)
}
