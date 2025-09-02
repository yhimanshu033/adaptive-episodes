import { useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import {
	EPISODE_LATEST_INFO_QUERY_KEY,
	EPISODE_LIST_QUERY_KEY,
} from '@/constants/query-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQueryClient } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

import { BASE_STATUS, EStatus } from '@/types/common'

export default function useVersions({
	latestStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
}) {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const queryClient = useQueryClient()

	const { setSelectedStatus } = useEpisodeIdStore()
	const { statusUpdateMutation } = useEpisodeHook()
	const { data } = useEpisodeContent()
	const { handleSave, isSaved } = useSaving()

	const latestIndex = useMemo(
		() => (latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0),
		[latestStatus]
	)

	const handleSelect = (value: EStatus) => {
		const currentIndex = statuses.indexOf(value)
		currentSelection.current = value
		if (currentIndex > latestIndex) {
			setIsDialogOpen(true)
		} else {
			if (!isSaved) {
				void handleSave()
			}
			setSelectedStatus(value)
		}
	}

	const handleConfirm = async () => {
		if (currentSelection.current) {
			const chapterId = data?.chapter.parent || data?.chapter.id || 0
			await handleSave({ forced: true })
			await statusUpdateMutation.mutateAsync({
				parent_id: chapterId,
				status: latestStatus,
				language: data?.chapter.language,
			})
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LATEST_INFO_QUERY_KEY, episodeId, id],
				exact: false,
			})
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
				type: 'all',
			})
		}
	}

	return {
		handleConfirm,
		handleSelect,
		isDialogOpen,
		statusUpdateMutation,
		latestIndex,
		setIsDialogOpen,
		currentSelection: currentSelection.current,
	}
}
