import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

import { BASE_STATUS, EStatus } from '@/types/common'

import useEpisodeContent from '../query/use-episode-content'

const useEpisodeHook = () => {
	const { id, episodeId } = useParams()
	const { data } = useEpisodeContent()
	const status = data?.chapter.status || BASE_STATUS
	const chapterId = data?.chapter.parent || Number(episodeId)

	const onSaveEpisode = useCallback(
		({
			text,
			statusChange,
			selectedChapterId,
			selectedProjectId,
		}: {
			selectedChapterId?: number
			selectedProjectId?: number
			statusChange?: EStatus
			text: string
		}) => {
			return saveContent({
				episodeId: selectedChapterId || chapterId,
				projectId: selectedProjectId || Number(id),
				text,
				status:
					statusChange ||
					(status === BASE_STATUS ? EStatus.FIRST_DRAFT : status),
			})
		},
		[chapterId, id, status]
	)

	const saveEpisodeMutation = useMutation({
		mutationKey: ['save', id, chapterId],
		mutationFn: onSaveEpisode,
	})

	return { saveEpisodeMutation }
}

export default useEpisodeHook
