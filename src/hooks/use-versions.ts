import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useCustomPlateStore from '@/store/plate-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorPlugin, useEditorState } from '@udecode/plate-common/react'

import { useEpisodeContext } from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS, EStatus } from '@/types/common'
import { ESidebar } from '@/types/plate-types'

export default function useVersions({
	latestStatus,
	selectedStatus,
	isChildEpisode,
	setSelectedStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
	selectedStatus: EStatus | undefined
	setSelectedStatus: React.Dispatch<React.SetStateAction<EStatus | undefined>>
}) {
	const { id } = useParams()
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const queryClient = useQueryClient()

	const { saveEpisodeMutation } = useEpisodeHook()
	const { useOption } = useEditorPlugin(FindReplacePlugin)
	const replaceEnabled = useOption('replaceEnabled')
	const { setViewMode } = useCustomPlateStore()
	const { usePlateStoreContext } = useEpisodeContext()
	const { sidebar } = usePlateStoreContext()
	const { data } = useEpisodeContent()
	const { children } = useEditorState()
	const { allComments } = useComments()

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
			setSelectedStatus(value)
		}
	}

	const handleConfirm = async () => {
		if (currentSelection.current) {
			const text = JSON.stringify(clearLasers(children))
			const chapterId = data?.chapter.parent
			const comments = allComments
			const prevProps = data?.chapter.props
			await saveEpisodeMutation.mutateAsync({
				status: data?.chapter.status || BASE_STATUS,
				chapterId,
				text,
				comments,
				prevProps,
			})
			await saveEpisodeMutation.mutateAsync({
				chapterId,
				text: 'Status update',
				status: currentSelection.current,
			})
			await queryClient.invalidateQueries({ queryKey: ['info'], type: 'all' })
			await queryClient.invalidateQueries({
				queryKey: [Number(id), 'episodes'],
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
		saveEpisodeMutation,
		latestIndex,
		setIsDialogOpen,
		currentSelection: currentSelection.current,
	}
}
