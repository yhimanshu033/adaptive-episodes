import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

import { EStatus } from '@/types/common'

import useEpisodeContent from '../query/use-episode-content'

const useEpisodeHook = () => {
	const { id } = useParams()
	const { data } = useEpisodeContent()
	const onSaveEpisode = useCallback(
		(text: string) => {
			return saveContent({
				title: data?.chapter.chapter_title || '',
				projectId: Number(id),
				text,
				status: data?.chapter.status || EStatus.FIRST_DRAFT,
				seq: data?.chapter.seq_number || 1,
			})
		},
		[data, id]
	)

	const saveEpisodeMutation = useMutation({
		mutationKey: ['save', id, data?.chapter.chapter_title],
		mutationFn: onSaveEpisode,
	})

	return { saveEpisodeMutation }
}

export default useEpisodeHook
