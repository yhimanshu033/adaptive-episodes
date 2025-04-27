import { useMemo } from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorState } from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import usePlayer from '@/providers/player-provider'
import { getText } from '@/lib/utils/plate'

export default function useStreamedTTS() {
	const { children } = useEditorState()
	const text = useMemo(() => getText(children, '.\n'), [children])
	const { initialStoryData } = useEpisodeTableContext()
	const { store: episodeStore } = useEpisodeIdStore()
	const episodeTitle = episodeStore(useShallow((state) => state.currentTitle))

	const { mutation } = usePlayer()

	const infoData = useMemo(
		() => ({
			img: initialStoryData?.image,
			chapter: initialStoryData?.project_title,
			episode: episodeTitle,
		}),
		[initialStoryData, episodeTitle]
	)

	function onTTSMutation() {
		if (!text) {
			return
		}
		mutation.mutate({
			info: infoData,
			text,
		})
	}

	return { ...mutation, mutate: onTTSMutation }
}
