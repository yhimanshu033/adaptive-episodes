import { useMemo } from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import usePlayer from '@/providers/player-provider'

export default function useStreamedTTS() {
	const { editorText: text } = useEditorData()
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
