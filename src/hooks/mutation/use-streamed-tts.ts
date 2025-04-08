import { useMemo } from 'react'
import { TTS_MUTATION } from '@/constants/query-constants'
import { elevenLabsTTS } from '@/server-action/external'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useMutation } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'
import { toast } from 'sonner'
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

	const { setPlayingEpisode } = usePlayer()

	const infoData = useMemo(
		() => ({
			img: initialStoryData?.image,
			chapter: initialStoryData?.project_title,
			episode: episodeTitle,
		}),
		[initialStoryData, episodeTitle]
	)

	async function ttsMutation() {
		setPlayingEpisode({
			info: infoData,
			src: '',
		})
		const chunks = await elevenLabsTTS(text)

		if (!chunks) return

		const blob = new Blob(chunks, { type: 'audio/mpeg' })
		const audioUrl = URL.createObjectURL(blob)

		return audioUrl
	}

	const mutation = useMutation({
		mutationKey: [TTS_MUTATION],
		mutationFn: ttsMutation,
		onSuccess: (data) => {
			if (!data) {
				toast.error('Error in TTS conversion')
				setPlayingEpisode(null)
				return
			}
			setPlayingEpisode({
				info: infoData,
				src: data,
			})
		},
	})

	return mutation
}
