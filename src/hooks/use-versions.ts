import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import {
	EPISODE_INFO_QUERY_KEY,
	EPISODE_LIST_QUERY_KEY,
} from '@/constants/query-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import useCustomPlateStore from '@/store/plate-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorPlugin } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeId, {
	useEpisodeContext,
} from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'

import { BASE_STATUS, EStatus } from '@/types/common'
import { ESidebar } from '@/types/plate-types'

export default function useVersions({
	latestStatus,
	isChildEpisode,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
}) {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const queryClient = useQueryClient()

	const { setSelectedStatus, store: useEpisodeIdStoreContext } =
		useEpisodeIdStore()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedStatus)
	)
	const { statusUpdateMutation } = useEpisodeHook()
	const replaceEnabled =
		useEditorPlugin(FindReplacePlugin).getOption('replaceEnabled')
	const { setViewMode } = useCustomPlateStore()
	const { usePlateStoreContext } = useEpisodeContext()
	const { sidebar } = usePlateStoreContext()
	const { data } = useEpisodeContent()
	const { handleSave, isSaved } = useSaving()

	const latestIndex = useMemo(
		() => (latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0),
		[latestStatus]
	)
	const selectedIndex = useMemo(
		() => (selectedStatus ? statuses.indexOf(selectedStatus) : latestIndex),
		[latestIndex, selectedStatus]
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
				status:
					latestStatus === BASE_STATUS ? EStatus.FIRST_DRAFT : latestStatus,
				language: data?.chapter.language,
			})
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_INFO_QUERY_KEY, episodeId, id],
			})
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
				type: 'all',
			})
		}
	}
	useEffect(() => {
		setViewMode(
			isChildEpisode ||
				selectedIndex < latestIndex + Number(isChildEpisode) ||
				(sidebar === ESidebar.FAR && !!replaceEnabled)
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isChildEpisode,
		latestIndex,
		latestStatus,
		selectedIndex,
		selectedStatus,
		sidebar,
		replaceEnabled,
	])

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
